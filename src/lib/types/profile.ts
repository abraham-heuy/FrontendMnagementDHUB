// src/lib/types/studentProfile.ts
export interface StudentProfile {
    id: string;
    field: string;
    stage?: string;
    interests?: string;
    skills?: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }
  