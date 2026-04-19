import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css"; // reuse same styling

export default function AdminLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch(
        "https://epoll.onrender.com/api/v1/auth/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();
      console.log("ADMIN LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // ✅ store admin token
      localStorage.clear();
      localStorage.setItem("adminToken", data.access_token);

      alert("Admin login successful!");

      // 👉 redirect to admin dashboard (create this later)
      nav("/admin-dashboard");

    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>

      <input
        placeholder="Enter Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleAdminLogin}>
        Login
      </button>
    </div>
  );
}