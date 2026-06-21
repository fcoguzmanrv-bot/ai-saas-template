"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ plan, usedToday, dailyLimit }: {
  plan: string;
  usedToday: number;
  dailyLimit: number | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.code === "LIMIT_REACHED") {
          setError(data.error);
        } else {
          setError("Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: assistantContent };
            return updated;
          });
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isFree = plan === "FREE";
  const remaining = dailyLimit ? dailyLimit - usedToday : null;

  return (
    <div className="flex flex-col h-full">
      {/* Usage indicator for free users */}
      {isFree && dailyLimit && (
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Daily AI requests</span>
            <span>{usedToday}/{dailyLimit}</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${(usedToday / dailyLimit) * 100}%` }} />
          </div>
          {remaining === 0 && (
            <p className="mt-1 text-xs text-orange-600 font-medium">
              Daily limit reached. <a href="/billing" className="underline">Upgrade to Pro</a> for unlimited requests.
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Ask me anything</h3>
            <p className="text-sm text-gray-500 max-w-xs">I&apos;m your AI assistant powered by Claude. How can I help you today?</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              msg.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              {msg.role === "user" ? "U" : "AI"}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"
            }`}>
              {msg.content || (loading && i === messages.length - 1 ? (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                </span>
              ) : "")}
            </div>
          </div>
        ))}
        {error && (
          <div className="mx-auto max-w-sm rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400"
            disabled={loading || (isFree && remaining === 0)} />
          <button type="submit" disabled={loading || !input.trim() || (isFree && remaining === 0)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
