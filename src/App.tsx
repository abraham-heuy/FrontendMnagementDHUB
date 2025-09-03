import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Application from "./pages/Application";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LoginPage from "./components/Admin/LoginPage";
import AdminPage from "./pages/Admin";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<Students />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signIn" element={<Login />} />
        <Route path="/apply" element={<Application />} />

        {/* Admin feature routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default App;
