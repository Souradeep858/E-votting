// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function VoterRedirect() {
//   const { pollId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (pollId) {
//       navigate(`/verify/${pollId}`);
//     }
//   }, [pollId, navigate]);

//   return <p>Redirecting...</p>;
// }