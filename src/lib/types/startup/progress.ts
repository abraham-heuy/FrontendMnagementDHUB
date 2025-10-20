import type { SubStage } from "./substage";

export interface StartupProgress {
  id: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  scoreAwarded: number;
  comment?: string | null;
  // relation pointers (may be full objects or just ids depending on endpoint)
  subStage: SubStage;
  startup?: { startup_id: string; title?: string } | null;
  reviewedBy?: { id: string; fullName?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}