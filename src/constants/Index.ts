//  files that import all the assets and then exports them

import logo from "../assets/images/Logo.png";
import heroImg from "../assets/react.svg";
import loginBanner from "../assets/images/Banner.png"
import mentorIllustration from "../assets/images/mentor_illustrator.jpg";
import mentorIllustration2 from "../assets/images/mentor_illustration.png";
import successImg from "../assets/images/success.png";


export {
  logo,
  heroImg,
  loginBanner,
  mentorIllustration,
  mentorIllustration2,
  successImg
};

// Gallery Images with Event Details
export const galleryImages = [
  {
    id: 1,
    src: loginBanner,
    title: "Startup Bootcamp 2024",
    description: "Intensive 3-day workshop on entrepreneurship fundamentals",
    date: "March 15, 2024",
    participants: 45
  },
  {
    id: 2,
    src: mentorIllustration,
    title: "Mentorship Launch Event",
    description: "Official launch of our mentorship program connecting students with industry experts",
    date: "February 20, 2024",
    participants: 78
  },
  {
    id: 3,
    src: successImg,
    title: "Pitch Competition Finals",
    description: "Top 10 startups presenting their ideas to investors",
    date: "April 10, 2024",
    participants: 120
  },
  {
    id: 4,
    src: mentorIllustration2,
    title: "Innovation Workshop",
    description: "Hands-on session on design thinking and innovation strategies",
    date: "January 25, 2024",
    participants: 62
  },
  {
    id: 5,
    src: loginBanner,
    title: "Networking Mixer",
    description: "Connect with fellow entrepreneurs and potential collaborators",
    date: "May 5, 2024",
    participants: 95
  },
  {
    id: 6,
    src: mentorIllustration,
    title: "Tech Talk Series",
    description: "Industry leaders sharing insights on emerging technologies",
    date: "March 30, 2024",
    participants: 110
  },
  {
    id: 7,
    src: successImg,
    title: "Funding Workshop",
    description: "Learn how to secure funding for your startup",
    date: "April 18, 2024",
    participants: 88
  },
  {
    id: 8,
    src: mentorIllustration2,
    title: "Demo Day 2024",
    description: "Startups showcase their products to potential investors",
    date: "May 20, 2024",
    participants: 150
  }
];