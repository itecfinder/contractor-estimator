"use client"

import { ChevronRight, FolderClock, Plus } from "lucide-react"
import { useApp } from "@/lib/store"
import { computeTotals } from "@/lib/services/pricing"
import { projectTypeLabels } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "../status-badge"

export function History() {
  const { t, lang, projects, openProject, startProject, money } = useApp()

  return (
    <div className="flex flex-col gap-4">
      
      {projects.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted">
            <FolderClock className="size-7" />
          </span>

          <p className="text-sm text-muted-foreground">
            No projects yet
          </p>

          <Button onClick={startProject}>
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border p-3"
              onClick={() => openProject(p.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {projectTypeLabels[p.type ?? "homeRemodel"]?.[lang]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
