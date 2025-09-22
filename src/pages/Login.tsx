import { Route, Routes } from "react-router-dom"
import Login from "../components/Auth/login"
import ForgotPassword from "../components/Auth/ForgotPassword"


// authentication page for admin and students to login
const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default Auth