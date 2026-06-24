import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function DashboardLayout({ children }) {
  const cookie = cookies().get("session")?.value

  let session = null

  if (cookie) {
    try {
      session = JSON.parse(cookie)
    } catch {
      session = null
    }
  }

  if (!session?.loggedIn) {
    redirect("/login")
  }

  return <>{children}</>
}
