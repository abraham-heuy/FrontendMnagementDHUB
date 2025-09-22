// startup service to handle startup-related API calls

import baseURL from "../environment";
import type { Startup } from "../types/startup";

export const startupService = {
  // 1.Admin privallges
  // 1.2 Get all startups
  getAll: async (): Promise<Startup[]> => {
    const response = await fetch(`${baseURL}/startups/getAll`, {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Failed to fetch startups");
    }

    const data = await response.json()
    return data.startups
  },

  //1.2 advance startup stages
  promoteStage: async (startupId: number): Promise<void> => {
    const response = await fetch(`${baseURL}/startups/${startupId}/advance`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to promote startup stage");
    }
  },
  // 1.4 delete startup
  delete: async (startupId: number): Promise<void> => {
    const response = await fetch(`${baseURL}/startups/delete/${startupId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete startup");
    }
  },

  //1.5  Get next stage and substage info
  getNextStageInfo: async (startupId: number): Promise<any> => {
    const response = await fetch(`${baseURL}/startups/${startupId}/next-stage`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch next stage info");
    }
    return response.json();
  },
  // 2. Student privileges  
  // 2.1 get startup for the logged-in user(student)
  // 2.1 get startup for the logged-in user(student)
  getMyStartup: async (): Promise<Startup[]> => {
    const response = await fetch(`${baseURL}/startups/mystartup`, {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Failed to fetch startup");
    }

    const data = await response.json();
    return data.startup;
  }
}