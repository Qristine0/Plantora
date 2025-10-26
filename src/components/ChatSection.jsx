import { useState } from "react";

const BACKEND_URL = "https://plantora.onrender.com";
// http://localhost:3000

export default function ChatSection() {
  const [messages, setMessages] = useState([
    {
      sender: "🌿 პლანტორა",
      text: "გამარჯობა, დამისვი ნებისმიერი კითხვა აგროკულტურაზე",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "👨‍🌾 შენ", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    console.log(input);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      console.log(data);
      const reply = data || "❗ვერ მივიღე პასუხი.";

      setMessages([
        ...newMessages,
        {
          sender: "🌿 პლანტორა",
          text: reply.reply
            .split("*")
            .filter((a) => a.length > 0)
            .join(" "),
        },
      ]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages([
        ...newMessages,
        { sender: "🌿 პლანტორა", text: "დაფიქსირდა შეცდომა 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md ">
      <h2 className="text-green-700 font-semibold mb-2">ჩათი</h2>
      <div className="bg-gray-50 p-2 rounded-lg overflow-y-auto h-[70vh]">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm text-gray-700 mb-1">
            {msg.sender}: {msg.text}
          </p>
        ))}
        {loading && (
          <p className="text-sm text-gray-400 italic">🌿 პლანტორა ფიქრობს...</p>
        )}
      </div>

      <form onSubmit={sendMessage}>
        <input
          className="mt-2 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
          placeholder="მესიჯის დაწერა..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </div>
  );
}
