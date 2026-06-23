"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!email.includes("@")) return

    setLoading(true)

    try {
      // TEMP AUTH (replace later with BD auth API)
      localStorage.setItem("bd_user_email", email)

      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to continue
          </p>
        </div>

        {/* Email input */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        {/* Continue button */}
        <Button
          onClick={handleContinue}
          disabled={!email.includes("@") || loading}
          className="w-full"
        >
          {loading ? "Continuing..." : "Continue"}
        </Button>

      </div>
    </div>
  )
}
