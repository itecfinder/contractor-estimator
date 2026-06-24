import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { AppProvider } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/auth/session", {
    cache: "no-store",
  })

  const session = await res.json()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <AppProvider>
      <AppShell />
      <Toaster position="top-center" />
    </AppProvider>
  )
}
