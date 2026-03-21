import React, { useState, useRef, useEffect } from "react";
import { api } from "@/api/apiClient";
import { Sparkles, Send, Image, Mic, BookOpen, Code, Calculator, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const quickPrompts = [
  { icon: BookOpen, label: "Concepts", prompt: "Explain React hooks to me", color: "text-blue-600 bg-blue-50" },
  { icon: Code, label: "Coding", prompt: "Debug this JavaScript code", color: "text-purple-600 bg-purple-50" },
  { icon: Calculator, label: "Math", prompt: "Solve this math problem step by step", color: "text-green-600 bg-green-50" },
  { icon: FileText, label: "Study", prompt: "Summarize this topic for my exam", color: "text-orange-600 bg-orange-50" },
];

export default function AITutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.ai.invokeLLM({
        prompt: `You are SkyBrisk AI Tutor - a helpful, friendly learning assistant. Help the student with their question. Use clear explanations, examples, and emojis where appropriate. If it's a coding question, provide code examples. If it's math, show step-by-step solutions.\n\nStudent's question: ${text}`,
      });
      const content = typeof response === "string" && response.trim()
        ? response
        : typeof response === "object" && response !== null
          ? JSON.stringify(response)
          : "Sorry, I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (err) {
      const msg = err?.message || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-950" style={{ height: "calc(100dvh - 48px)" }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all overflow-hidden flex-shrink-0`}>
        <div className="p-4">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl gap-2" onClick={() => setMessages([])}>
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>
        <div className="flex-1 px-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Recent Chats</p>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No chat history yet</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate py-2">Current conversation</div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Chat
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm dark:text-white">SkyBrisk AI Tutor</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Your personal learning assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-6" style={{ WebkitOverflowScrolling: "touch" }}>
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help you today?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10">Ask me anything about your studies, coding problems, or career advice</p>
              <div className="grid grid-cols-2 gap-4">
                {quickPrompts.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => sendMessage(item.prompt)}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-left hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-md"
                        : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-md"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <ReactMarkdown className="text-sm prose prose-sm prose-gray dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-md px-5 py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask me anything..."
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-base dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500 pr-20 min-h-[52px]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl w-12 h-12 p-0 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  );
}

function Clock(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}