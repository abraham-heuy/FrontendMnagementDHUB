// stage service for student stages

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export type StudentStage = {
  id: string;
  stageName?: string;
  status?: string;
  started_at?: string;
  completed_at?: string | null;
  activities?: Array<{ id: string; name: string; status: string }>;
};

export const stageService = {
  getMyCurrentStage: async (): Promise<StudentStage | null> => {
    const res = await fetch(`${apiURL}/stages/me/current`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch current stage");
    return res.json();
  },
  getMyStages: async (): Promise<StudentStage[]> => {
    const res = await fetch(`${apiURL}/stages/me`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch stages");
    return res.json();
  },
};




