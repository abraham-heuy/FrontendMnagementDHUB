import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Application from "./pages/Application";
import LoginPage from "./components/Admin/LoginPage";
import ProtectedRoute from "./components/Admin/protect";
import Auth from "./pages/Login";
import NotFound from "./components/NotFoundWildcard";
import About from "./pages/About";
import DashboardOverview from "./components/Admin/home";
import Events from "./components/Admin/events";
import Applications from "./components/Admin/applications";
import StudentManagement from "./components/Admin/students";
import MentorManagement from "./components/Admin/mentors";
import Notifications from "./components/Admin/notifications";
import Analytics from "./components/Admin/analytics";
import Reports from "./components/Admin/reports";
import AccountSettings from "./components/Admin/settings";
import StudentAccountSettings from "./components/students/Profile/AccountSettings";
import NotificationList from "./components/students/Notifications/NotificationList";
import ResourceList from "./components/students/Resources/ResourceList";
import MentorList from "./components/students/Mentors/MentorList";
import EventList from "./components/students/Events/EventList";
import StatusProgess from "./components/students/Progress/StatusProgess";
import AdminPage from "./pages/Admin";
import StudentPage from "./pages/Students";
import Main from "./components/students/Main/Main";
// Correct the import path and filename case if needed

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply" element={<Application />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin routes (protected) */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/dashboard/admin/*" element={<AdminPage />}>
            <Route path="home" element={<DashboardOverview />} />
            <Route path="events" element={<Events />} />
            <Route path="applications" element={<Applications />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="mentors" element={<MentorManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Student routes (protected) */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="/dashboard/student/*" element={<StudentPage />}>
            <Route path="main" element={<Main />} />
            <Route path="progress" element={<StatusProgess />} />
            <Route path="events" element={<EventList />} />
            <Route path="mentors" element={<MentorList />} />
            <Route path="resources" element={<ResourceList />} />
            <Route path="notifications" element={<NotificationList />} />
            <Route path="profile" element={<StudentAccountSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>

    </>
  );
};

export default App;
