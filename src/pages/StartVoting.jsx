import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

export default function StartVoting() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  return (
    <div className="auth-container">
      <h1>E-Voting</h1>
      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => nav("/verify", { state: { email } })}>
        Generate OTP
      </button>
    </div>
  );
}