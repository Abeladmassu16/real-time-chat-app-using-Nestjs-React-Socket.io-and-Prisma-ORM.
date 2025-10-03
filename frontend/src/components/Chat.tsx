import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { apiBase } from "../api";
import "../styles/chat.css";

type Message = {
  id?: string;
  content: string;
  createdAt?: string;
  username: string;
  room?: string;
};

export default function Chat({
  username,
  room,
}: {
  username: string;
  room: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const base = apiBase();
  const endRef = useRef<HTMLDivElement | null>(null);

  // initial history
  useEffect(() => {
    fetch(`${base}/messages?room=${encodeURIComponent(room)}`)
      .then((r) => r.json())
      .then((rows) => {
        const mapped = rows.map((r: any) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt,
          username: r.user.username,
          room,
        }));
        setMessages(mapped);
      })
      .catch(console.error);
  }, [base, room]);

  // socket
  useEffect(() => {
    const s = io(`${base}/chat`, {
      transports: ["websocket"],
      query: { username, room },
    });
    socketRef.current = s;

    s.on("system", (payload: any) => {
      setMessages((prev) => [
        ...prev,
        {
          content: `[system] ${payload.message}`,
          username: "system",
          createdAt: new Date().toISOString(),
          room,
        },
      ]);
    });

    s.on("chat:message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [base, username, room]);

  // auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    socketRef.current?.emit("chat:message", {
      content: text,
      roomId: room,
      username,
    });
    setInput("");
  };

  const Row = (m: Message) => {
    const isSystem = m.username === "system";
    const isSelf = m.username === username;

    const rowClass = isSystem
      ? "msg-row center"
      : isSelf
      ? "msg-row right"
      : "msg-row left";
    const bubbleClass = isSystem
      ? "bubble system"
      : isSelf
      ? "bubble self"
      : "bubble";
    const metaClass = isSystem ? "meta" : isSelf ? "meta right" : "meta left";
    const time = m.createdAt
      ? new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div className={rowClass} key={m.id ?? `${m.username}-${Math.random()}`}>
        <div className={bubbleClass}>
          {!isSystem && !isSelf && (
            <div className={metaClass}>{m.username}</div>
          )}
          <div>{isSystem ? m.content : m.content}</div>
          {!isSystem && (
            <div className={metaClass} style={{ marginTop: 6 }}>
              {time}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h2>Glassy Chat</h2>
        <span className="subtle">Room: {room}</span>
        <span className="subtle" style={{ marginLeft: "auto" }}>
          You: {username}
        </span>
      </div>

      <div className="chat-scroll">
        {messages.map(Row)}
        <div ref={endRef} />
      </div>

      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => (e.key === "Enter" ? send() : undefined)}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
