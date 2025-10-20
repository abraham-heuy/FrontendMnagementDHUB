export interface SubStage {
    substage_id: string;
    name: string;
    order: number;
    weightScore: number;
    status: string;
    scoreAwarded?: number;
    reviewerComment?: string | null;
  }