'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from 'lucide-react'

import { cn } from "@/lib/utils"
import { LoginService } from "@/services/login"
import { LoginSchema, type LoginSchemaValues } from "@/datas/login"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (form.formState.isDirty) {
      setServerError(null)
      form.clearErrors(["email", "password"])
    }
  }, [form.formState.isDirty, form])

  const onSubmit = async (data: LoginSchemaValues) => {
    setServerError(null)
    form.clearErrors("email")
    form.clearErrors("password")

    try {
      const response = await LoginService({ email: data.email, password: data.password })

      if (response.token) {
        localStorage.setItem("token", response.token)
        if (response.user && response.user.outlet_id) {
          localStorage.setItem("outlet_id", response.user.outlet_id)
        }
        if (response.user && response.user.roles && response.user.roles.length > 0) {
          localStorage.setItem("role_id", response.user.roles[0].id.toString());
        }
        router.push("/dashboard")
      } else {
        setServerError("Login gagal. Respons tidak valid dari server.")
      }
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "Terjadi kesalahan yang tidak diketahui."
      if (errorMessage.toLowerCase().includes('salah') || errorMessage.toLowerCase().includes('unauthorized')) {
        setServerError("Email atau password yang Anda masukkan salah.")
        form.setError("email", { type: "server" })
        form.setError("password", { type: "server" })
      } else {
        setServerError(errorMessage)
      }
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn("flex flex-col gap-6", className)} 
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-primary">Welcome</h1>
          <p className="text-muted-foreground text-sm text-balance mb-2">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="your password"
                      {...field}
                      disabled={isLoading}
                      className="pr-10"
                      aria-invalid={!!form.formState.errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError &&
            !isLoading &&
            !Object.entries(form.formState.errors).some(([_, err]) => err.type !== "server") && (
              <p className="text-sm text-red-500 -mt-3">{serverError}</p>
          )}


          <div className="flex items-center space-x-2 mt-4">
            {/* <Switch>
            </Switch>
            <label htmlFor="remember" className="select-none text-sm font-medium text-gray-900 dark:text-gray-300">
              Remember me?
            </label> */}
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full",
              { "cursor-pointer": !isLoading },
              { "cursor-not-allowed": isLoading }
            )}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {/* <a
            href="#"
            className="text-center text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a> */}
        </div>

        {/* <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div> */}
      </form>
    </Form>
  )
}
