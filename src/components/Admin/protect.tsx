
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { fetchMe } from "../../utils/api";
import AccessDenied from "./limitedaccess";

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await fetchMe();
        if (me && me.id) {
          setUser(me);
        } else {
          setUser(null);
          setNotLoggedIn(true);
          setTimeout(() => setRedirect(true), 2000);
        }
      } catch (err) {
        setUser(null);
        setNotLoggedIn(true);
        setTimeout(() => setRedirect(true), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Checking authentication...</p>;
  if (redirect) return <Navigate to="/" replace />;
  if (notLoggedIn) return <p>Not logged in...</p>;
  if (requiredRole && user.role !== requiredRole) return <AccessDenied />;

  return <Outlet />;
};


export default ProtectedRoute;
