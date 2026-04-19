import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

export default function AdminDashboard() {
  const nav = useNavigate();

  const [agendas, setAgendas] = useState([]);

  const [pollId, setPollId] = useState(null);
  const [pollTitle, setPollTitle] = useState("");
  const [showPollForm, setShowPollForm] = useState(false);

  const [title, setTitle] = useState("");

  // 🔥 manual option inputs
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");

  const [emails, setEmails] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      alert("Unauthorized");
      nav("/admin-login");
    }
  }, []);

  // 🔄 fetch agendas
  const fetchAgendas = async (id = pollId) => {
    if (!id) return;

    try {
      const res = await fetch(
        `https://epoll.onrender.com/api/v1/polls/${id}/agendas/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) setAgendas(data);
      else console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, [pollId]);

  // 🟢 CREATE POLL
  const handleCreatePoll = async () => {
    if (!pollTitle.trim()) return alert("Enter poll title");

    const res = await fetch(
      "https://epoll.onrender.com/api/v1/polls/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: pollTitle.trim(),
          start_date: new Date().toISOString(),
          end_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          allow_vote_change: false,
          vote_receipt_email: true,
          weighted_votes: false,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) return alert(data.detail || "Poll failed");

    setPollId(data.id || data._id);
    setPollTitle("");
    setShowPollForm(false);
    alert("Poll created");
  };

  // 🔥 normalize backend-safe options
  const normalizeOption = (val) => {
    const v = val.trim().toLowerCase();

    if (v.includes("accept") || v.includes("yes"))
      return "Accept/Yes";

    if (v.includes("reject") || v.includes("no"))
      return "Reject/No";

    if (v.includes("abstain") || v.includes("view"))
      return "Abstain/No View";

    return null;
  };

  // 🟢 CREATE AGENDA (FIXED)
  const handleCreateAgenda = async () => {
    if (!pollId) return alert("Create poll first");
    if (!title.trim()) return alert("Title required");

    const rawOptions = [option1, option2, option3];

    const mappedOptions = rawOptions
      .map(normalizeOption)
      .filter(Boolean);

    if (mappedOptions.length !== 3) {
      return alert(
        "Invalid options. Use Accept/Yes, Reject/No, Abstain/No View"
      );
    }

    const payload = {
      title: title.trim(),
      order: agendas.length + 1,
      options: mappedOptions,
    };

    const res = await fetch(
      `https://epoll.onrender.com/api/v1/polls/${pollId}/agendas/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      return alert(data.detail || "Agenda failed");
    }

    alert("Agenda created");

    setTitle("");
    setOption1("");
    setOption2("");
    setOption3("");

    fetchAgendas();
  };

  // 🟢 ADD VOTERS
  const handleAddVoters = async () => {
  if (!pollId) return alert("Create poll first");

  const emailList = emails
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!emailList.length) {
    return alert("Enter at least one email");
  }

  const payload = {
    voters: emailList.map((email) => ({
      email,
      name: email.split("@")[0], // simple fallback name
      weightage: 1,
    })),
  };

  try {
    const res = await fetch(
      `https://epoll.onrender.com/api/v1/polls/${pollId}/voters/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    console.log("VOTER RESPONSE:", data);

    if (!res.ok) {
      alert(data.detail || "Failed to add voters");
      return;
    }

    alert("Voters added successfully!");
    setEmails("");
  } catch (err) {
    console.error(err);
  }
};

  // 🟢 PUBLISH
  const handlePublish = async () => {
    const res = await fetch(
      `https://epoll.onrender.com/api/v1/polls/${pollId}/publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) return alert(data.detail || "Publish failed");

    alert("Poll published");
  };

  return (
    <div className="auth-container">
      <h2>Admin Dashboard</h2>

      {/* POLL */}
      <h3>Create Poll</h3>

      <button onClick={() => setShowPollForm(!showPollForm)}>
        {showPollForm ? "Close" : "Create Poll"}
      </button>

      {showPollForm && (
        <div>
          <input
            placeholder="Poll Title"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
          />
          <button onClick={handleCreatePoll}>
            Submit Poll
          </button>
        </div>
      )}

      {/* AGENDA */}
      <h3>Create Agenda</h3>

      <input
        placeholder="Agenda Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Option 1 (Yes/Accept)"
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
      />

      <input
        placeholder="Option 2 (No/Reject)"
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
      />

      <input
        placeholder="Option 3 (Abstain)"
        value={option3}
        onChange={(e) => setOption3(e.target.value)}
      />

      <button onClick={handleCreateAgenda}>
        Create Agenda
      </button>

      {/* VOTERS */}
      <h3>Add Voter Emails</h3>

      <input
        placeholder="Emails (comma separated)"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
      />

      <button onClick={handleAddVoters}>
        Add Voters
      </button>

      {/* PUBLISH */}
      <button
        onClick={handlePublish}
        style={{
          marginTop: "10px",
          background: "green",
          color: "white",
        }}
      >
        Publish Poll
      </button>

      {/* LIST */}
      <h3>Agendas</h3>

      {agendas.length === 0 ? (
        <p>No agendas</p>
      ) : (
        agendas.map((a, i) => (
          <div key={i}>
            <h4>{a.title}</h4>
            <ul>
              {a.options?.map((o, j) => (
                <li key={j}>{o}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}