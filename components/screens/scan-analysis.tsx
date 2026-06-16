"use client"

import { useState, useRef } from "react"
import {
  AlertTriangle,
  ArrowRight,
  ImagePlus,
  Loader2,
  Ruler,
  Sparkles,
  X,
} from "lucide-react"
import { useApp } from "@/lib/store"
import { generateAnalysis, generateLineItems, uid } from "@/lib/mock"
import { Button } from "@/components/ui/button"
import { ScreenHeader, StickyBar } from "./parts"
import { cn } from "@/lib/utils"

const severityCls: Record<string, string> = {
  low: "text-chart-2",
  medium: "text-chart-5",
  high: "text-destructive",
}
export function ScanAnalysis() {
  const { t, current, updateCurrent, saveCurrent, go } = useApp()
const [busy, setBusy] = useState(false)
const fileInputRef = useRef<HTMLInputElement>(null)

if (!current) return null

const handleUpload = (
event: React.ChangeEvent<HTMLInputElement>
) => {
const file = event.target.files?.[0]

if (!file) return

const imageUrl = URL.createObjectURL(file)

updateCurrent({
images: [
...current.images,
{
id: uid(),
url: imageUrl,
scanMode: "generic",
},
],
})
}

const removeImage = (id: string) => {
updateCurrent({
images: current.images.filter((i) => i.id !== id),
})
}

const analyze = () => {
if (!current.type) return

setBusy(true)

setTimeout(() => {
updateCurrent({
analysis: generateAnalysis(current.type!),
})

setBusy(false)

}, 1400)
}

const buildEstimate = () => {
if (!current.type) return

const items = current.lineItems.length
? current.lineItems
: generateLineItems(current.type)

updateCurrent({
lineItems: items,
status: "estimated",
})

saveCurrent()
go("estimate")
}

return (

  <div>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleUpload}
      className="hidden"
    />

<ScreenHeader
  title="Project Photos"
  step={{ current: 2, total: 4 }}
  back="capture"
/>

<div className="space-y-5 px-4 pt-4">

  <Button
    variant="default"
    className="h-12 w-full"
    onClick={() => fileInputRef.current?.click()}
  >
    <ImagePlus className="size-5" />
    Add Project Photos
  </Button>

  {current.images.length > 0 && (
    <div>
      <p className="mb-2 text-sm font-semibold">
        {current.images.length} Photos Added
      </p>

      <div className="grid grid-cols-3 gap-2">
        {current.images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-lg border"
          >
            <img
              src={img.url}
              alt=""
              className="size-full object-cover"
            />

            <button
              onClick={() => removeImage(img.id)}
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-secondary"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {!current.analysis && (
    <Button
      onClick={analyze}
      disabled={current.images.length === 0 || busy}
      className="h-12 w-full"
    >
      {busy ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="size-5" />
          Analyze Project
        </>
      )}
    </Button>
  )}

  {current.analysis && (
    <div className="space-y-4">

      <ResultCard
        title={t("detectedSurfaces")}
        icon={<Ruler className="size-4 text-primary" />}
      >
        {current.analysis.surfaces.map((s, i) => (
          <li
            key={i}
            className="flex items-center justify-between py-1.5 text-sm"
          >
            <span>{s.label}</span>
            <span>
              {s.area} {s.unit}
            </span>
          </li>
        ))}
      </ResultCard>

      <ResultCard
        title={t("damageFindings")}
        icon={<AlertTriangle className="size-4 text-chart-5" />}
      >
        {current.analysis.damage.map((d, i) => (
          <li
            key={i}
            className="flex items-center justify-between py-1.5 text-sm"
          >
            <span>{d.label}</span>
            <span
              className={cn(
                "text-xs font-semibold uppercase",
                severityCls[d.severity]
              )}
            >
              {d.severity}
            </span>
          </li>
        ))}
      </ResultCard>

      <ResultCard
        title={t("scopeItems")}
        icon={<Sparkles className="size-4 text-primary" />}
      >
        {current.analysis.scope.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-2 py-1 text-sm"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {s}
          </li>
        ))}
      </ResultCard>

    </div>
  )}
</div>

{current.analysis && (
  <StickyBar>
    <Button
      onClick={buildEstimate}
      className="h-12 w-full"
    >
      Build Estimate
      <ArrowRight className="size-5" />
    </Button>
  </StickyBar>
)}

  </div>
)
