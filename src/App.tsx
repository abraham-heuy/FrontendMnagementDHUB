import { Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Students from "./pages/Students"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/students" element={ <Students />} />
    </Routes>
    </>
  )
}
export default App