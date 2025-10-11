export interface MentorProfile {
    id: string;
    specialization: string;
    experience: string;
    recentProject: string;
    contact: string;
    user?: {
      id: string;
      fullName: string;
      email: string;
    };
  }
  
  export interface MentorProfileFormData {
    specialization: string;
    experience: string;
    recentProject: string;
    contact: string;
  }
  
  export interface StudentSummary {
    id: string;
    name: string;
    field: string | null;
    institution?: string | null;
    course?: string | null;
    yearOfStudy?: string | null;
    email?: string | null;
  }
  
  
  export interface MentorAllocation {
    id: string;
    mentor: {
      id: string;
      name: string;
      specialization?: string;
    };
    student: {
      id: string;
      name: string;
      field?: string;
    };
  }
  