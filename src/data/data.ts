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
