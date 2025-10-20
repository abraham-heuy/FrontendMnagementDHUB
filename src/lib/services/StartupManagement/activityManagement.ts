import type { Stage } from "../../types/startup/stage";
import type { SubStage } from "../../types/startup/substage";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * =============================
 * STAGE SERVICES
 * =============================
 */

// 🟢 Get all stages (with substages)
export const getAllStages = async (): Promise<Stage[]> => {
  const res = await fetch(`${API_URL}/activities/stages`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stages");
  return await res.json();
};

// 🟢 Create a new stage
export const createStage = async (data: {
  name: string;
  order: number;
}): Promise<{ message: string; stage: Stage }> => {
  const res = await fetch(`${API_URL}/activities/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create stage");
  return await res.json();
};

// 🟢 Update a stage
export const updateStage = async (
  stageId: string,
  data: Partial<{ name: string; order: number }>
): Promise<{ message: string; stage: Stage }> => {
  const res = await fetch(`${API_URL}/activities/stages/${stageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update stage");
  return await res.json();
};

// 🟢 Delete a stage
export const deleteStage = async (
  stageId: string
): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/activities/stages/${stageId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete stage");
  return await res.json();
};

/**
 * =============================
 * SUBSTAGE SERVICES
 * =============================
 */

// 🟢 Get all substages
export const getAllSubstages = async (): Promise<SubStage[]> => {
  const res = await fetch(`${API_URL}/activities/substages`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch substages");
  return await res.json();
};

// 🟢 Create a substage
export const createSubstage = async (data: {
  name: string;
  order: number;
  weightScore: number;
  stageId: string;
  status?: string;
}): Promise<{ message: string; substage: SubStage }> => {
  const res = await fetch(`${API_URL}/activities/substages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create substage");
  return await res.json();
};

// 🟢 Update a substage
export const updateSubstage = async (
  substageId: string,
  data: Partial<{ name: string; order: number; weightScore: number; status: string }>
): Promise<{ message: string; substage: SubStage }> => {
  const res = await fetch(`${API_URL}/activities/substages/${substageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update substage");
  return await res.json();
};

// 🟢 Delete a substage
export const deleteSubstage = async (
  substageId: string
): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/activities/substages/${substageId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete substage");
  return await res.json();
};
