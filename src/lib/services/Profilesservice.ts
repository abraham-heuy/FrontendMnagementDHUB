import type { StudentProfile } from "../types/profile";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * ✅ Get logged-in student's profile
 */
export const getMyStudentProfile = async (): Promise<StudentProfile> => {
  const res = await fetch(`${API_URL}/profile/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch student profile");
  }

  return res.json();
};

/**
 * ✅ Create or update logged-in student's profile
 */
export const upsertMyStudentProfile = async (
  profileData: Partial<StudentProfile>
): Promise<StudentProfile> => {
  const res = await fetch(`${API_URL}/profile/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    throw new Error("Failed to create or update student profile");
  }

  return res.json();
};

/**
 * ✅ Get a student's profile by userId (Admin/Mentor only)
 */
export const getStudentProfileByUserId = async (
  userId: string
): Promise<StudentProfile> => {
  const res = await fetch(`${API_URL}/profile/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch student profile for userId: ${userId}`);
  }

  return res.json();
};

/**
 * ✅ List all student profiles (Admin dashboard)
 */
export const listAllStudentProfiles = async (): Promise<StudentProfile[]> => {
  const res = await fetch(`${API_URL}/profile/`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all student profiles");
  }

  const data = await res.json();

  // Ensure always return an array
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.profiles)) return data.profiles;

  throw new Error("Unexpected response format for student profiles");
};
