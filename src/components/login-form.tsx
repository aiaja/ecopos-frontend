'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
    console.log(form)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Handle form submission logic here
    if (form.email && form.password) {
      const response = await fetch("https://tannn.my.id/api/login", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        // Handle successful login
        console.log("Login successful", data)
        localStorage.setItem("token", data.token)
        router.push("/dashboard")

      } else {
        // Handle login error
        console.error("Login failed", data)
      }
    } else {
      alert("Please fill in all fields")
      }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={onSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-primary">Welcome</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="email@example.com" required onChange={handleChange}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" name="password" required  onChange={handleChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch>
          </Switch>
          <label htmlFor="remember" className="select-none text-sm font-medium text-gray-900 dark:text-gray-300">
            Remember me?
          </label>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
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
