import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { sender: "👨‍🌾 ნინო", text: "დღეს როგორ უნდა მოვრწყა?" },
    { sender: "🌿 კახა", text: "ორ ლიტრამდე საკმარისია." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "👨‍🌾 შენ", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });
      console.log(response.text);

      // const res = await fetch(
      //   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-goog-api-key": GEMINI_API_KEY,
      //     },
      //     body: JSON.stringify({
      //       contents: [{ role: "user", parts: [{ text: input }] }],
      //     }),
      //   }
      // );

      // const data = await res.json();
      const reply = response.text || "❗ვერ მივიღე პასუხი.";

      setMessages([...newMessages, { sender: "🌿 კახა", text: reply }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages([
        ...newMessages,
        { sender: "🌿 კახა", text: "დაფიქსირდა შეცდომა 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h2 className="text-green-700 font-semibold mb-2">ჩათი</h2>
      <div className="bg-gray-50 p-2 h-64 rounded-lg overflow-y-auto">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm text-gray-700 mb-1">
            {msg.sender}: {msg.text}
          </p>
        ))}
        {loading && (
          <p className="text-sm text-gray-400 italic">🌿 კახა ფიქრობს...</p>
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
