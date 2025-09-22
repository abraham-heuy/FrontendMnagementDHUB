// role types
export interface Role {
    role_id: number;
    role_name: string;
  }
  // user types
  export interface User {
    id: number;
    fullName: string;
    regNumber: string;
    email: string;
    phone: string;
    role: Role;
    stage: string;
    createdAt: string;
    updatedAt: string;
  }