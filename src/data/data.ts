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


// Startup Stages
export const startupStages = [
  {
    name: 'Pre-Incuubation',
    subStages: ["Idection", "Concept & Solution", "Market Reserch "]
  },

]



// mock data
export const events = [
  { id: "1", title: "Design Thinking Workshop", date: "Fri, Sep 12", location: "Main Hall", status: "Open" as const },
  { id: "2", title: "Investor Pitch Night", date: "Sat, Oct 04", location: "Auditorium", status: "Applied" as const },
  { id: "3", title: "Lean Startup 101", date: "Wed, Oct 15", location: "Online", status: "Closed" as const },
];

export const mentors = [
  { id: "m1", name: "Dr. Njeri K.", expertise: "AgriTech, Analytics", email: "njeri@example.com" },
  { id: "m2", name: "John M.", expertise: "Fundraising, GTM", email: "john@example.com" },
];

export const resources = [
  { id: "r1", title: "Business Model Canvas (Template)", type: "Template" as const, href: "#" },
  { id: "r2", title: "Pitch Deck Guide", type: "Guide" as const, href: "#" },
  { id: "r3", title: "Market Sizing Tutorial", type: "Link" as const, href: "#" },
];

export const notes = [
  { id: "n1", title: "Your application for Pitch Night is under review", time: "2h ago", kind: "Update" as const },
  { id: "n2", title: "Submit Monthly Report by Friday", time: "Yesterday", kind: "Reminder" as const },
  { id: "n3", title: "Prototype milestone approved 🎉", time: "Last week", kind: "Approval" as const },
];