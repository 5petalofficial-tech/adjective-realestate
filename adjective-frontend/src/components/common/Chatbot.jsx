// export default function Chatbot() {
//   return null;
// }
"use client";
import{useState} from "react";

export default function Chatbot() {
  const[messages, setMessages] = useState([]);
  const[input, setInput] = useState("");
  const[loading, setLoading] = useState(false);

  const sendMessage = async() => {
    if (input.trim()) return;
    const newMessages = [...messages, {role: "user", content: input}];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res= await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ messages: newMessages}),
    });
    const data = await res.json();

    setMessages([...newMessages, {role: "assistant", content: data.reply}]);
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, width: 350}}>
      <div style={{ height: 300, overflowY: "auto"}}>
        {messages.map((m ,i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "8px 0"}}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.content}
            </div>
        ))}
        {loading && <p>Bot is typing...</p>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask something..."
        style={{ width: "80%"}}
        />
        <button onClick={sendMessage}>Send</button>
    </div>
  );

}