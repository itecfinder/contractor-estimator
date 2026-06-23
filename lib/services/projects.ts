import { uid } from "./mock"
import type { Project, ProjectTypeKey } from "./types"
import { defaultEstimate } from "@/services/pricing"
function blankProject(type: ProjectTypeKey | null = null): Project {
  return {
    id: uid(),
    createdAt: Date.now(),
    status: "draft",
    type,
    customer: { name: "", phone: "", email: "", address: "", zip: "" },
    notes: "",
    images: [],
    analysis: null,
    estimate: { ...defaultEstimate },
    lineItems: [],
    paymentTerms: "Due on receipt",
    invoiceNumber: null,
  }
}
