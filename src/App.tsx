import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Application from "./pages/Application";
import LoginPage from "./components/Admin/LoginPage";
import AdminPage from "./pages/Admin";
import ProtectedRoute from "./components/Admin/protect";
import Auth from "./pages/Login";
import NotFound from "./components/NotFoundWildcard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<Students />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/apply" element={<Application />} />
        {/* Admin feature routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminPage />} requiredRole="admin" />
          }
        />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default App;
