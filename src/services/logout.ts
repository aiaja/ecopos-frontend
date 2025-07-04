import { BASE_URL } from "./BASE_URL"

export async function logoutService() {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) throw new Error("Gagal logout")

    const data = await response.json()
    console.log(data.message)

    // Bersihkan token atau session lokal
    localStorage.removeItem("access_token")

    // Redirect ke halaman login
    window.location.href = "/login"
  } catch (error) {
    console.error("Logout error:", error)
  }
}
