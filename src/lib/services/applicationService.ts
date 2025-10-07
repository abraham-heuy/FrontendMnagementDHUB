// src/services/applicationService.ts

import type { Application, ApplicationFormData } from "../types/appliction";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Submit a new application for a specific event
 */
export const applyToEvent = async (
  eventId: string,
  data: ApplicationFormData
): Promise<Application> => {
  const res = await fetch(`${API_URL}/applications/${eventId}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit application");
  }

  const response = await res.json();
  return response.application;
};

/**
 * Get all applications for a specific event (admin only)
 */
export const getApplicationsForEvent = async (
  eventId: string
): Promise<Application[]> => {
  const res = await fetch(`${API_URL}/applications/${eventId}/applications`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data = await res.json();

  // Normalize and safely parse teamMembers
  const applications: Application[] = (data.applications || []).map(
    (app: Application) => ({
      ...app,
      teamMembers: parseTeamMembers(app.teamMembers),
    })
  );

  return applications;
};

/**
 * Mark an application result (pass/fail) - admin only
 */
export const markApplicationResult = async (
  appId: string,
  isPassed: boolean
): Promise<Application> => {
  const res = await fetch(`${API_URL}/applications/${appId}/result`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isPassed }),
  });

  if (!res.ok) {
    throw new Error("Failed to update application result");
  }

  const response = await res.json();
  return response.application;
};

/**
 * Helper function: Parse teamMembers JSON string safely
 */
function parseTeamMembers(raw: string | any): any {
  if (typeof raw !== "string") return raw;

  try {
    // Clean weird stringified JSON sets like: {"{...}","{...}"}
    const cleaned = raw
      .replace(/^{|}$/g, "")
      .replace(/""/g, '"')
      .replace(/\\\"/g, '"')
      .split("},")
      .map((item) => {
        const fixed = item.endsWith("}") ? item : `${item}}`;
        return JSON.parse(fixed.replace(/\\/g, ""));
      });
    return cleaned;
  } catch (error) {
    console.warn("Failed to parse teamMembers:", error);
    return [];
  }
}
