import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Vote() {
  const nav = useNavigate();

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [agendaId, setAgendaId] = useState("");

  const pollId = localStorage.getItem("pollId");

  const handleAuthError = (res) => {
    if (res.status === 401) {
      alert("Session expired or unauthorized. Please verify again.");
      localStorage.clear();
      nav("/verify");
      return true;
    }
    return false;
  };

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);
      console.log("POLL ID:", pollId);

      const res = await fetch(
        `https://epoll.onrender.com/api/v1/polls/${pollId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (handleAuthError(res)) return;

      const data = await res.json();
      console.log("POLL RESPONSE:", data);

      if (!res.ok) {
        alert(data.detail || "Failed to load poll");
        return;
      }


      if (data.agendas && data.agendas.length > 0) {
        const agenda = data.agendas[0]; // assuming single question

        setTitle(agenda.title || "Vote");
        setOptions(agenda.options || []);
        setAgendaId(agenda.id);
      }

      else if (data.options) {
        setTitle(data.title || "Vote");
        setOptions(data.options || []);
        setAgendaId(data.id);
      }

      else {
        alert("No voting data found in poll");
      }

    } catch (err) {
      console.error(err);
      alert("Error loading poll");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleVote = async () => {
    if (!selected) {
      alert("Select an option");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const voterId = localStorage.getItem("voterId");

      const res = await fetch(
        "https://epoll.onrender.com/api/v1/vote-cast",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            poll_id: pollId,
            agenda_id: agendaId,
            option_text: selected,
            voter_id: voterId,
          }),
        }
      );

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      if (!res.ok) {
        alert("Failed to submit vote");
        return;
      }

      alert("Vote submitted successfully!");
      nav("/success");

    } catch (err) {
      console.error(err);
      alert("Error submitting vote");
    }
  };

  return (
    <div className="auth-container">
      <h2>{title || "Loading..."}</h2>

      {options.length === 0 ? (
        <p>Loading poll...</p>
      ) : (
        options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="vote"
                value={opt}
                onChange={() => setSelected(opt)}
              />
              {opt}
            </label>
          </div>
        ))
      )}

      <button onClick={handleVote}>
        Submit Vote
      </button>
    </div>
  );
}