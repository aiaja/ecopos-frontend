import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold" style={{ color: "var(--main-blue)" }}>Welcome!</h1>
        <p className="text-muted-foreground text-sm text-balance" style={{ color: "var(--text-light)" }}>
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com" />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              style={{ color: "var(--text-light)" }}
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="w-11 h-6 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 checked:bg-[var(--main-blue)] relative cursor-pointer transition-colors duration-200 before:absolute before:top-0.5 before:left-[2px] before:bg-white before:border before:border-gray-300 before:rounded-full before:h-5 before:w-5 before:transition-transform checked:before:translate-x-5"
          />
          <label htmlFor="remember" className="select-none text-sm font-medium text-gray-900 dark:text-gray-300">
            Remember me?
          </label>
        </div>
        <Button type="submit" className="w-full" style={{ backgroundColor: "var(--main-blue)" }}>
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
