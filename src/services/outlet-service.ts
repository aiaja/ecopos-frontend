import { BASE_URL } from "./BASE_URL";
import type { Outlet, OutletsApiResponse } from "@/datas/outlet";

export async function getAllOutlets(): Promise<Outlet[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Autentikasi dibutuhkan. Token tidak ditemukan.");
  }

  const response = await fetch(`${BASE_URL}/outlets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Gagal mengambil data outlet (HTTP ${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (error) { 
        throw new Error(errorMessage)
    }
  }

  const data: OutletsApiResponse = await response.json();
  return data.outlets;
}