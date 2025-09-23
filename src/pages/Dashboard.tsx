import { Route, Routes } from "react-router-dom"
import Admin from "./Admin"

import StartupTrack from "../components/students/Startups/StartupTrack"
import DashboardOverview from "../components/Admin/home"
import Events from "../components/Admin/events"
import Applications from "../components/Admin/applications"
import StudentManagement from "../components/Admin/students"
import NotFound from "../components/NotFoundWildcard"
import MentorManagement from "../components/Admin/mentors"
import Notifications from "../components/Admin/notifications"
import Analytics from "../components/Admin/analytics"
import Reports from "../components/Admin/reports"
import AccountSettings from "../components/Admin/settings"
import StudentPage from "./Students"

const Dashboard = () => {
  return (
    <div>
      <Routes>
        {/* Admin routes -> /dashboard/admin/... */}
        <Route path="admin" element={<Admin />}>
          <Route path="*" element={<NotFound />} />
          <Route path="home" element={<DashboardOverview />} />
          <Route path="events" element={<Events />} />
          <Route path="applications" element={<Applications />} />

          <Route path="students" element={<StudentManagement />} />
          <Route path="mentors" element={<MentorManagement />} />
          <Route path="notifications" element={<Notifications />} />

          <Route path="analytics" element={<Analytics />} />

          <Route path="reports" element={<Reports />} />

          <Route path="settings" element={<AccountSettings />} />


        </Route>

        {/* Example for other dashboard stuff */}
        <Route path="student" element={<StudentPage />}>
          <Route path="startup" element={<StartupTrack />} />

        </Route>
        {/* <Route path="forgot-password" element={<StudentPage />} /> */}
      </Routes>
    </div>
  )
}

export default Dashboard