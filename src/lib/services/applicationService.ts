// src/services/applicationService.ts

import type { Application, ApplicationFormData } from "../types/appliction";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Apply for pitching (create a new pitching application)
 */
export const applyForPitching = async (
  data: ApplicationFormData
): Promise<Application> => {
  const res = await fetch(`${API_URL}/pitch/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to apply for pitching: ${text}`);
  }

  const response = await res.json();
  return response.application || response; // handles both wrapped/unwrapped response
};

/**
 * Get all pitching applications (admin or reviewer)
 */
export const getAllPitchingApplications = async (): Promise<Application[]> => {
  const res = await fetch(`${API_URL}/pitch/`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pitching applications");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.applications || [];
};

/**
 * Get a single pitching application by ID
 */
export const getPitchingApplication = async (
  id: string
): Promise<Application> => {
  const res = await fetch(`${API_URL}/pitch/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pitching application");
  }

  return await res.json();
};

/**
 * Approve a pitching application (admin action)
 */
export const approvePitchingApplication = async (
  applicationId: string
): Promise<{ message: string; user?: any; startup?: any }> => {
  const res = await fetch(
    `${API_URL}/pitch/${applicationId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to approve application: ${errText}`);
  }

  return await res.json();
};

/**
 * Reject a pitching application (admin action)
 */
export const rejectPitchingApplication = async (
  applicationId: string
): Promise<{ message: string }> => {
  const res = await fetch(
    `${API_URL}/pitch/${applicationId}/reject`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to reject application: ${errText}`);
  }

  return await res.json();
};

/**
 * Delete a pitching application (admin action)
 */
export const deletePitchingApplication = async (
  applicationId: string
): Promise<{ message: string }> => {
  const res = await fetch(
    `${API_URL}/pitch/${applicationId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete pitching application");
  }

  return await res.json();
};

/**
 * -------------------------------
 * Existing event-related methods
 * -------------------------------
 */

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
 * Helper: Parse teamMembers JSON safely
 */
function parseTeamMembers(raw: string | any): any {
  if (typeof raw !== "string") return raw;

  try {
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
