import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import MentorNav from "../components/Mentor/mentorNav";

interface Mentor {
  name: string;
  email: string;
  role: string;
  image?: string;
}

const apiURL = import.meta.env.VITE_API_URL;

export default function MentorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mentor, setMentor] = useState<Mentor>({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiURL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setMentor({
            name: data.fullName,
            email: data.email,
            role: data.role,
            image: data.image,
          });
        } else {
          navigate("/auth/login");
        }
      } catch {
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.endsWith("/mentor") || path.endsWith("/mentor/")) return "Home";
    return path.split("/").pop()?.toLowerCase() || "home";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-emerald-700 font-semibold">
        Loading Mentor Dashboard...
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <MentorNav />
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto mt-[80px] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-4 capitalize">
            {getCurrentTab()}
          </h2>
          <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 border border-emerald-100">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
