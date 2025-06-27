import Image from "next/image";
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Kolom Kiri - Form Login */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      {/* Kolom Kanan - Branding Area */}
      <div className="bg-primary flex items-center justify-center hidden lg:flex rounded-bl-2xl">
      <Image
          src="/ecopos logo white.png" 
          alt="Ecopos Logo White"
          width={150}
          height={150}
          priority
          className="h-auto w-36"
        />
      </div>
    </div>
  )
}
