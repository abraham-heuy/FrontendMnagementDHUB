import { Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Students from "./pages/Students"
import Application from "./pages/Application"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/students" element={ <Students />} />
      <Route path="/apply" element={ <Application />} />
    </Routes>
    </>
  )
}
export default App