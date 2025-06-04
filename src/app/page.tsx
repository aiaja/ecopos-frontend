"use client";

import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const outletId = localStorage.getItem("outlet_id");
    if (!token && !outletId) {
      router.push("/login");
    } else {
      router.push(`/dashboard`);
    }
  }, [router]);
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="animate-spin-slow"
      />
    </div>
  );
}
