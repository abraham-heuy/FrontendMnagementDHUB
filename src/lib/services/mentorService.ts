import type {
  MentorAllocation,
  MentorProfile,
  MentorProfileFormData,
  StudentSummary,
} from "../types/mentor";

const API_URL = import.meta.env.VITE_API_URL;

/** ✅ Admin: Get all mentors */
export const getAllMentors = async (): Promise<MentorProfile[]> => {
  const res = await fetch(`${API_URL}/mentor/all`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch all mentors");
  return res.json();
};

/** ✅ Mentor: Get my profile */
export const getMyMentorProfile = async (): Promise<MentorProfile> => {
  const res = await fetch(`${API_URL}/mentor/me/profile`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch mentor profile");
  return res.json();
};

/** ✅ Mentor: Create or update my profile */
export const upsertMyMentorProfile = async (
  data: MentorProfileFormData
): Promise<MentorProfile> => {
  const res = await fetch(`${API_URL}/mentor/me/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update mentor profile");
  return res.json();
};

/** ✅ Admin/Mentor: Get profile by mentorId */
export const getMentorProfileById = async (
  mentorId: string
): Promise<MentorProfile> => {
  const res = await fetch(`${API_URL}/mentor/profile/${mentorId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch mentor profile by ID");
  return res.json();
};

/** ✅ Mentor: Get my allocated students */
export const getMyAllocatedStudents = async (): Promise<StudentSummary[]> => {
  const res = await fetch(`${API_URL}/mentor/me/students`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch allocated students");
  const data = await res.json();

  // normalize response
  if (Array.isArray(data.students)) return data.students;
  if (Array.isArray(data)) return data;
  throw new Error("Unexpected response format for allocated students");
};

/** ✅ Student: Get my allocated mentor */
export const getMyAllocatedMentor = async (): Promise<MentorProfile> => {
  const res = await fetch(`${API_URL}/mentor/me/mentor`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch allocated mentor");
  return res.json();
};

/** ✅ Admin: Assign a student to a mentor */
export const assignStudentToMentor = async (mentorId: string,studentId: string): Promise<MentorAllocation> => {
  const res = await fetch(`${API_URL}/mentor/allocate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mentorId, studentId }),
  });
  if (!res.ok) throw new Error("Failed to assign student to mentor");
  return res.json();
};

/** ✅ Admin: Unassign a student from a mentor */
export const unassignStudentFromMentor = async (
  allocationId: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/mentor/allocation/${allocationId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to unassign student from mentor");
};

/** ✅ Admin: Get all mentor-student allocations */
export const getAllAllocations = async (): Promise<MentorAllocation[]> => {
  const res = await fetch(`${API_URL}/mentor/allocations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch all mentor-student allocations");
  const data = await res.json();

  // Normalize to always return array under `.allocations`
  if (Array.isArray(data.allocations)) return data.allocations;
  if (Array.isArray(data)) return data;
  throw new Error("Unexpected response format for allocations");
};
