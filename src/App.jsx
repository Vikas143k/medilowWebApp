
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicineSearch from "./component/medicineSearch";
import LandingPage from "./component/landingpage/landingPage";
import MedicineDetail from "./component/MedicineDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<MedicineSearch />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
      </Routes>
    </Router>
  )
}
    