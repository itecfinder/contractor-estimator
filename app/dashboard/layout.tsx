import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AppShell from "@/components/app-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookie = cookies().get("session")?.value

  let session = null

  try {
    session = cookie ? JSON.parse(cookie) : null
  } catch {}

  if (!session?.loggedIn) {
    redirect("/login")
  }

  return <AppShell session={session}>{children}</AppShell>
}
