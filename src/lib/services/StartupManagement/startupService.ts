// src/services/startupProgressService.ts

import type { StartupProgress } from "../../types/startup/progress";
import type { Startup } from "../../types/startup/startup";
import type { SubStage } from "../../types/startup/substage";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ----------------------------
 *  MENTEE ROUTES
 * ----------------------------
 */

/**
 * Get all substages for the logged-in mentee’s current stage
 */
export const getMenteeSubstages = async (): Promise<SubStage[]> => {
  const res = await fetch(`${API_URL}/startup/mentee/substages`, {
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to fetch mentee substages: ${msg}`);
  }

  return await res.json();
};

/**
 * Submit an activity (substage) for review
 */
export const submitMenteeSubstage = async (
  substageId: string
): Promise<{ message: string; progress: StartupProgress }> => {
  const res = await fetch(`${API_URL}/startup/mentee/substages/${substageId}/submit`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to submit substage: ${msg}`);
  }

  return await res.json();
};

/**
 * Check if mentee can move to next substage or stage
 */
export const checkMenteeStageProgression = async (): Promise<{
  message: string;
  startup: Startup;
  nextStage?: any;
}> => {
  const res = await fetch(`${API_URL}/startup/mentee/stage/progression`, {
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to check stage progression: ${msg}`);
  }

  return await res.json();
};

/**
 * ----------------------------
 *  REVIEWER / ADMIN ROUTES
 * ----------------------------
 */

/**
 * Review (approve/reject) a submitted substage
 */
export const reviewMenteeSubstage = async (
  progressId: string,
  approve: boolean,
  scoreAwarded: number,
  comment?: string
): Promise<{ message: string; progress: StartupProgress }> => {
  const res = await fetch(`${API_URL}/startup/review/substages/${progressId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ approve, scoreAwarded, comment }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to review substage: ${msg}`);
  }

  return await res.json();
};
