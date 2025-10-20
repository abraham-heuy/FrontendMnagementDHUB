import type { SubStage } from "./substage";

export interface Stage {
    stage_id: string;
    name: string;
    order: number;
    description?: string | null;
    // Substages that belong to this stage (may be included by backend)
    substages?: SubStage[];
  }