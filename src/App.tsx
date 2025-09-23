import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Application from "./pages/Application";
import LoginPage from "./components/Admin/LoginPage";
import AdminPage from "./pages/Admin";
import ProtectedRoute from "./components/Admin/protect";
import Auth from "./pages/Login";
import NotFound from "./components/NotFoundWildcard";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import StudentPage from "./pages/Students";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/apply" element={<Application />} />
        {/* Admin feature routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute element={<AdminPage />} requiredRole="admin" />
          }
        />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Student feature routes */}
        <Route path="/dashboard/student"
          element={<ProtectedRoute
            element={<StudentPage />}
            requiredRole="student" />
          }
        />

      </Routes>
    </>
  );
};

export default App;
