export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  objective: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  details: string;
  category: string;
  created_at: string;
  updated_at: string;
  createdBy?: {
    id: string;
    email: string;
    fullName: string;
  };
  applications: any[];
}

  
  export interface EventFormData {
    title:string;
    description:string;
    date:string;
    location:string;
  }