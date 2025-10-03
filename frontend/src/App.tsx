import React, { useEffect, useMemo, useState } from "react";
import Chat from "./components/Chat";
import { apiBase } from "./api";

export default function App() {
  const [username, setUsername] = useState<string>(
    "user" + Math.floor(Math.random() * 1000)
  );
  const [room, setRoom] = useState<string>("general");
  const base = useMemo(() => apiBase(), []);

  return (
    <div className="container">
      <h1 style={{ margin: "4px 0 12px 0", fontSize: 24, letterSpacing: 0.3 }}>
        ⚡ Real-time Chat
      </h1>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <label>Username:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <label style={{ marginLeft: 16 }}>Room:</label>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="room"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
          API: {base}
        </span>
      </div>
      <Chat username={username} room={room} />
    </div>
  );
}
