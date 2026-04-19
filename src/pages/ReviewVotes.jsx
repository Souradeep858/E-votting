import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function ReviewVotes() {
  const nav = useNavigate();
  const location = useLocation();

  const votes = location.state?.votes || null;
  const agendas = location.state?.agendas || [];

  if (!votes || agendas.length === 0) {
    return (
      <div className="auth-container">
        <h2>Session Expired</h2>
        <p>Your vote data is not available.</p>

        <button onClick={() => nav("/")}>
          Go Back to Start
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1>Your Votes</h1>

      {agendas.map((agenda) => (
        <div key={agenda.id} style={{ marginBottom: "12px" }}>
          <strong>{agenda.title}</strong>{" "}
          → {votes?.[agenda.id] || "Not Voted"}
        </div>
      ))}

      <button
        onClick={() =>
          nav("/receipt", { state: { votes, agendas } })
        }
      >
        Download Receipt
      </button>
    </div>
  );
}