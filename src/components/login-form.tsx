'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { LoginService } from "@/services/login"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, password } = form
    try{
      console.log("Submitting login form", { email, password })
      const response = await LoginService({ email, password })

      if (response.token) {
        console.log("Login successful", response.data)
        localStorage.setItem("token", response.token)
        localStorage.setItem("outlet_id", response.user.outlet_id)

        router.push("/dashboard")
      } else {
        console.error("Login failed", response.data)
      }
    } catch (error) {
      console.error("Login error", error)
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold text-primary">Welcome</h1>
        <p className="text-muted-foreground text-sm text-balance mb-2">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com" required name="email" onChange={handleChange}/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input id="password" type={showPassword ? "text" : "password"} className="w-full pr-10" placeholder="your password" required name="password" onChange={handleChange}/>
            <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch>
          </Switch>
          <label htmlFor="remember" className="select-none text-sm font-medium text-gray-900 dark:text-gray-300">
            Remember me?
          </label>
        </div>
        <Button type="submit" className="w-full ">
          Login
        </Button>
        <a
          href="#"
          className="text-center text-muted-foreground underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </div>



      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}

    </form>
  )
}