import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { OTPPage } from "./pages/OTPPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
