"use client"

import { useRef, type ChangeEvent } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { useApp } from "@/lib/store"
import { useBusinessSettings } from "@/lib/hooks/useBusinessSettings"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Settings() {
  const { t, lang, setLang, business: initial } = useApp()

  const {
    business,
    setBusiness,
    status,
    dirty,
  } = useBusinessSettings(initial)

  const fileRef = useRef<HTMLInputElement>(null)

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusiness({ logoUrl: URL.createObjectURL(file) })
  }

  return (
    <div className="space-y-6 px-4 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("settings")}</h1>

        {/* SAVE STATUS */}
        <span className="text-xs text-muted-foreground">
          {status === "saving" && "Saving..."}
          {status === "saved" && "Saved"}
          {status === "error" && "Error"}
          {!dirty && status === "idle" && "Up to date"}
        </span>
      </div>

      {/* BUSINESS NAME */}
      <Section title={t("businessProfile")}>
        <LabeledInput
          label={t("businessName")}
          value={business.name}
          onChange={(v) => setBusiness({ name: v })}
        />

        <LabeledInput
          label={t("email")}
          value={business.email}
          onChange={(v) => setBusiness({ email: v })}
        />

        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex size-14 items-center justify-center rounded border"
          >
            {business.logoUrl ? (
              <img src={business.logoUrl} className="size-full object-contain" />
            ) : (
              <Upload className="size-4" />
            )}
          </button>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={onLogo}
          />

          <Button onClick={() => fileRef.current?.click()}>
            {t("uploadLogo")}
          </Button>
        </div>
      </Section>

      {/* LANGUAGE */}
      <Section title={t("language")}>
        <div className="flex gap-2">
          {["en", "es"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={`flex-1 border rounded p-2 ${
                lang === l ? "bg-black text-white" : ""
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Section>

      {/* MANUAL SAVE (fallback) */}
      <Button
        onClick={() => toast.success(t("saved"))}
        className="w-full h-12"
      >
        {t("save")}
      </Button>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
