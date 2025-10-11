export interface StudentProfile {
  id: string;
  field: string;
  stage?: string;
  interests?: string;
  skills?: string[]; 
  institution?: string;
  course?: string;
  yearOfStudy?: string;
  startup_idea?: string;
  linkedIn?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
