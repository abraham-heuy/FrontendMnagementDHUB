import { FiHome, FiInfo, FiCalendar, FiEdit } from "react-icons/fi";

export const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    link: "/",
    icon: FiHome,
  },
  {
    id: 2,
    title: "About",
    link: "/about",
    icon: FiInfo,
  },
  {
    id: 3,
    title: "Events",
    link: "#",
    icon: FiCalendar,
    children: [
      { id: 31, title: "Hackathons", link: "/events/hackathons" },
      { id: 32, title: "Workshops", link: "/events/workshops" },
      { id: 33, title: "Seminars", link: "/events/seminars" },
    ],
  },
  {
    id: 4,
    title: "Apply",
    link: "/apply",
    icon: FiEdit,
  },
];


//  Application Steps 
 export const businessSections = [
    {
      title: "Business Idea",
      key: "businessIdea",
      description: "What is your core business concept?",
      guidance: "Describe your idea in 1-2 sentences. Example: 'A mobile app that connects local farmers directly with consumers'",
      placeholder: "Briefly describe your business idea..."
    },
    {
      title: "Problem Statement",
      key: "problemStatement",
      description: "What problem are you solving?",
      guidance: "Be specific about the pain points. Example: 'Farmers lose 30% of their produce due to inefficient distribution channels'",
      placeholder: "What problem does your business solve?..."
    },
    {
      title: "Proposed Solution",
      key: "solution",
      description: "How does your solution address the problem?",
      guidance: "Explain your unique approach. Example: 'Our platform eliminates middlemen through direct farm-to-table delivery'",
      placeholder: "How does your solution work?..."
    },
    {
      title: "Target Market",
      key: "targetMarket",
      description: "Who are your customers?",
      guidance: "Be specific about demographics, behaviors, or characteristics. Example: 'Urban professionals aged 25-45 who value fresh, locally-sourced food'",
      placeholder: "Describe your ideal customers..."
    },
    {
      title: "Revenue Model",
      key: "revenueModel",
      description: "How will you make money?",
      guidance: "Explain your pricing strategy. Example: '15% transaction fee, premium subscriptions for farmers'",
      placeholder: "Describe your business model..."
    }
  ];