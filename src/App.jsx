import { Routes, Route } from "react-router-dom";

import StartVoting from "./pages/StartVoting";
import Verify from "./pages/Verify";
import Vote from "./pages/Vote";
import Success from "./pages/Success";
import ReviewVotes from "./pages/ReviewVotes";
import Receipt from "./pages/Receipt";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// import VoterRedirect from "./pages/VoterRedirect";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartVoting />} />

      {/* <Route path="/voter/:pollId" element={<VoterRedirect />} /> */}
      <Route path="/verify" element={<Verify />} />

      <Route path="/vote" element={<Vote />} />
      <Route path="/success" element={<Success />} />
      <Route path="/review" element={<ReviewVotes />} />
      <Route path="/receipt" element={<Receipt />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}