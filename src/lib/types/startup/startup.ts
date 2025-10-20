import type { StartupProgress } from "./progress";
import type { Stage } from "./stage";
import type { SubStage } from "./substage";

export interface Startup {
    startup_id: string;
    title: string;
    description?: string | null;
    founder?: { id: string; fullName?: string; email?: string } | null;
    teamMembers?: any[];
    currentStage?: Stage | null;
    currentSubStage?: SubStage | null;
    progressHistory?: StartupProgress[];
    cumulativeScore?: number;
    status?: string;
  }