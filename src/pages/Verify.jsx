import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Auth.css";
import { useParams } from "react-router-dom";

export default function Verify() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const pollId = "69e367e52fbcebca277db6af"; 

  const goToAdmin = () => {
    nav("/admin-login"); 
  };

  const fetchCaptcha = async () => {
    try {
      const res = await fetch(
        "https://epoll.onrender.com/api/v1/auth/captcha"
      );
      const data = await res.json();

      setCaptchaImage(data.captcha_image_base64);
      setCaptchaToken(data.captcha_token);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSendOtp = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    const res = await fetch(
      "https://epoll.onrender.com/api/v1/auth/generate-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          poll_id: pollId,
        }),
      }
    );

    const data = await res.json();
    console.log("OTP Response:", data);

    if (!res.ok) {
      alert(data.detail || "Failed");
      return;
    }

    alert("OTP sent!");
  };

  const handleVerify = async () => {
    if (!otp || !captcha) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(
        "https://epoll.onrender.com/api/v1/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp_code: otp,
            captcha_answer: captcha,
            captcha_token: captchaToken,
            poll_id: pollId,
          }),
        }
      );

      const data = await res.json();
      console.log("Verify Response:", data);

      if (!res.ok) {
        alert(data.detail || "Verification failed");
        fetchCaptcha();
        return;
      }

      localStorage.clear();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("pollId", data.poll_id);
      localStorage.setItem("voterId", data.voter_id);

      alert("Verified successfully!");
      nav("/vote");

    } catch (err) {
      console.error(err);
      alert("Error verifying");
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify</h2>

      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSendOtp}>
        Send OTP
      </button>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {captchaImage && <img src={captchaImage} alt="captcha" />}

      <input
        placeholder="Enter CAPTCHA"
        value={captcha}
        onChange={(e) => setCaptcha(e.target.value)}
      />

      <button onClick={fetchCaptcha}>
        Refresh Captcha
      </button>

      <button onClick={handleVerify}>
        Verify
      </button>

      <button onClick={goToAdmin} className="admin-btn">
        Admin Panel Login
      </button>
    </div>
  );
}