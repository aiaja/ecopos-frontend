import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-[var(--main-blue)] flex items-center justify-center hidden lg:flex rounded-bl-[20px]">
        <img
          src="/ecopos logo white.png" 
          alt="Ecopos Logo White"
          className="w-[150px] h-[150px] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}