// profile service to handle student profile API calls

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export type StudentProfile = {
  id?: string;
  bio?: string;
  skills?: string[];
  startup_idea?: string;
  phone?: string;
  institution?: string;
  course?: string;
  yearOfStudy?: string;
  linkedIn?: string;
  website?: string;
  resumeUrl?: string;
};

export const profileService = {
  getMyProfile: async (): Promise<StudentProfile | null> => {
    const response = await fetch(`${apiURL}/profile/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 404) {
      return null; // profile not found yet
    }

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    return response.json();
  },

  upsertMyProfile: async (profile: StudentProfile): Promise<StudentProfile> => {
    const response = await fetch(`${apiURL}/profile/me`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error("Failed to save profile");
    }

    return response.json();
  },
};


