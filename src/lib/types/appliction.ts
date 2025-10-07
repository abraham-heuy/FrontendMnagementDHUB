// src/types/applications.ts

export interface TeamMember {
  name: string;
  email: string;
}

export interface EventSummary {
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
}

export interface Application {
  id: string;
  regNo?: string;
  name?: string;
  email?: string;
  phone: string;
  teamMembers: string | TeamMember[]; // backend sends string, we can parse to array
  businessIdea: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  isPassed: boolean;
  appliedAt: string;
  event: EventSummary;
}

export interface ApplicationFormData {
  regNo: string;
  name: string;
  email: string;
  phone: string;
  teamMembers?: TeamMember[] | string;
  businessIdea: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
}


