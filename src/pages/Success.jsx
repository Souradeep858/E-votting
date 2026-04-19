import { useNavigate } from "react-router-dom";
import "./Success.css";
import { useLocation } from "react-router-dom";

export default function Success() {
  const nav = useNavigate();  
  const { state } = useLocation();
  const votes = state?.votes;
  const agendas = state?.agendas;

return (
  <div className="success-container">
    
    <div className="success-icon">✅</div>
    
    <h1>Vote Submitted Successfully</h1>
    
    <p className="success-text">
      Thank you for participating in the voting process.
    </p>

  <button
  className="success-btn"
  onClick={() => nav("/review", { state: { votes, agendas } })}
>
  View Your Poll
</button>

  </div>
);
}
