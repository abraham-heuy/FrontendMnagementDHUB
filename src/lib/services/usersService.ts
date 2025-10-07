import type { User, UserFormData } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Fetch all users
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users/`, {
    method:"GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();

  if (Array.isArray(data.users)) {
    return data.users;
  }

  throw new Error("Unexpected response format for users");
};

// ✅ Fetch single user by ID
export const getUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method:"GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user with ID: ${id}`);
  }

  const data = await res.json();

  if (data.user) {
    return data.user;
  }

  throw new Error("Unexpected response format for single user");
};

// ✅ Create/register user (admin registration)
export const registerUser = async (data: UserFormData): Promise<User> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to register user");
  }

  const result = await res.json();

  if (result.user) {
    return result.user;
  }

  throw new Error("Unexpected response format during registration");
};

// ✅ Update user (admin or self)
export const updateUser = async (
  id: string,
  data: Partial<UserFormData>
): Promise<User> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update user with ID: ${id}`);
  }

  const result = await res.json();

  if (result.user) {
    return result.user;
  }

  throw new Error("Unexpected response format during update");
};

// ✅ Delete user
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete user with ID: ${id}`);
  }
};
