import { Route, Routes } from "react-router-dom"
import Admin from "./Admin"
import Students from "./Students"


import StartupTrack from "../components/students/Startups/StartupTrack"

const Dashboard = () => {
  return (
    <div>
      <Routes>
        {/* Admin routes -> /dashboard/admin/... */}
        <Route path="admin" element={<Admin />}>
      <Route index element={<Admin />} />
          {/* <Route index element={<Home />} />
          /
          <Route path="events" element={<Events />} />
          <Route path="applications" element={<Applications />} />
          <Route path="startups" element={<Startups />} />
          <Route path="manage" element={<ManageUsers />} />
          <Route path="notifications" element={<Notifications />} /> */}
        </Route>

        {/* Example for other dashboard stuff */}
        <Route path="student" element={<Students />}>
          <Route index element={<StartupTrack />} />

        </Route>

        <Route path="forgot-password" element={<Students />} />
      </Routes>
    </div>
  )
}

export default Dashboard