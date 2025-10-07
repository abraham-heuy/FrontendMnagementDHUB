// Represents a user object returned from the backend
export interface User {
  id: string;
  fullName: string;
  email: string;
  regNumber: string;
  role: string;       // e.g. "admin", "student", "mentor"
  stage?: string | null;  // only students have stage
  createdAt?: string;
  updatedAt?: string;
}

// Represents the data used when creating/registering a new user
export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  regNumber: string;
  roleName: string;   // e.g. "student", "admin", "mentor"
  stage?: string | null; // optional, only for student role
}
