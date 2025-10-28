// profile service to handle student profile API calls

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export type StudentProfile = {
  id?: string;
  category?: "Student" | "Non-Student";
  bio?: string;
  skills?: string[];
  startup_idea?: string;
  phone?: string;
  registrationNumber?: string;
  institution?: string;
  field?: string;
  course?: string;
  yearOfStudy?: string;
  linkedIn?: string;
  website?: string;
  resumeUrl?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    regNumber?: string;
    isActive: boolean;
    currentProject?: string;
    created_at: string;
    updated_at: string;
    role?: {
      id: number;
      name: string;
      description?: string;
    };
  };
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

    const data = await response.json();
    // Backend returns { message, profile, canCreate? }
    return data.profile || null;
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

    const data = await response.json();
    // Backend returns { message, profile }
    return data.profile;
  },
};


