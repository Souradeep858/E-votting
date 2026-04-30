import "./Auth.css";
import "./Receipt.css";
import { useNavigate } from "react-router-dom";

export default function Receipt() {
  const nav = useNavigate();

  const pollId = localStorage.getItem("pollId");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || "Unknown User";

  const downloadPDF = async () => {
    try {
      const res = await fetch(
        `https://epoll.onrender.com/api/v1/receipts/${pollId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("Error:", errText);
        alert("Failed to download receipt");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "e-voting-receipt.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Error downloading receipt");
    }
  };

  return (
    <div className="receipt-container">
      <div className="receipt-card">

        <div className="receipt-header">
          <h1>E-Voting Receipt</h1>
          <p className="receipt-sub">
            Thank you for participating
          </p>
        </div>

        <div className="receipt-info">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Poll ID:</strong> {pollId}</p>
          <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
        </div>

        <div className="receipt-section">
          <p>
            Your official receipt will be downloaded as a PDF.
          </p>
        </div>

        <button
          className="download-btn"
          onClick={downloadPDF}
        >
          Download PDF
        </button>


        <button onClick={() => nav("/")}>
          Back to Home
        </button>

      </div>
    </div>
  );
}
