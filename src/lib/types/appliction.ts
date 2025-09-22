export interface Application {
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
      status: "pending" | "approved" | "rejected";
      submissionDate: string;
      isApproved?: boolean;
      createdAt: string;
      updatedAt: string;
      user?: {
        user_id: number;
        name: string;
        first_name: string;
        last_name: string;
        email: string;
      }
    }