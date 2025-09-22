export interface Startup {
    startup_id: number;
    title: string;
    description: string;
    status: string;
    graduationDate?: string | null;
    reports: any[];
    teamMembers: any[];
    createdAt: string;
    updatedAt: string;
  
    application: {
      application_id: number;
      regNo: string;
      first_name: string;
      last_name: string;
      surname: string;
      email: string;
      phone: string;
      teamMembers: string;
      businessIdea: string;
      problemStatement: string;
      solution: string;
      targetMarket: string;
      revenueModel: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  
    founder: {
      user_id: number;
      first_name: string;
      last_name: string;
      surname: string;
      reg_number: string;
      email: string;
      phone: string;
      role: {
        role_id: number;
        role_name: string;
      };
    };
  
    stage: {
      stage_id: number;
      name: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    };
  
    subStage: {
      substage_id: number;
      name: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    };
  }
  