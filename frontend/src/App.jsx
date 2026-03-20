import { useEffect, useState, useRef } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const hasTracked = useRef(false);

  // ✅ get API URL from env
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!hasTracked.current) {
      axios.get(`${API_URL}/api/track`)
        .then(() => console.log("Tracked"))
        .catch(err => console.log("Track error:", err));

      hasTracked.current = true;
    }

    axios.get(`${API_URL}/api/stats`)
      .then(res => {
        console.log("API DATA:", res.data);
        setData(res.data);
      })
      .catch(err => console.log("Stats error:", err));
  }, [API_URL]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Visitor Dashboard</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Total Visitors: {data.totalVisitors}</h2>
          <h3>Total Visits: {data.totalVisits}</h3>

          <h2>Recent Visitors</h2>

          <ul>
            {data.visitors.map((v, i) => (
              <li key={i} style={{ marginBottom: "10px" }}>
                🌍 {v.city || "Unknown"}, {v.country || "Unknown"} <br />
                🧠 IP: {v.ip} <br />
                🔁 Visits: {v.visitCount} <br />
                🕒 Last Seen:{" "}
                {v.lastVisitedAt
                  ? new Date(v.lastVisitedAt).toLocaleString()
                  : "N/A"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;