// user service to handle user-related API calls
import type { User } from "../types/user";

const apiURL = import.meta.env.VITE_API_URL

export const usersService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${apiURL}/users/getAll`, {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json()
    return data.users as User[]
  },

  // get user by id
  getById: async (userId: number): Promise<any> => {
    const response = await fetch(`${apiURL}/users/${userId}`, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json()
    return data.user as User
  },
  
  update: async (userId: number, userData: Partial<Omit<User,"user_id" | "role">> & {role_id?:number}): Promise<void> => {
    const response = await fetch(`${apiURL}/users/update/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return;
  },


  // add new user
  add: async (userData:Omit<User,"user_id" | "role"> &{role_id:number}): Promise<User> => {
    const response = await fetch(`${apiURL}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    const data = await response.json()
    return data.user as User
  },

  // delete user
  delete: async (userId: number): Promise<{message:string}> => {
    const response = await fetch(`${apiURL}/users/delete/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return response.json();
  },
  
  // Assign mentors to students
  assignMentor: async (userId: number, mentorId: number[]): Promise<void> => {
    const response = await fetch(`${apiURL}/users/${userId}/assign-mentors`, {
      method: "PATCH",
      
      headers: { "Content-Type": "application/json" },
      credentials: "include",

      body: JSON.stringify({ mentorIds: mentorId })
    })
    if (!response.ok) {
      throw new Error("Failed to assign mentors");
    }
  }

}