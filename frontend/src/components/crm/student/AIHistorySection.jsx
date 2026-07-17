import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Sparkles, ChevronDown, ChevronUp, BookOpen, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIHistorySection({ user, enrollments }) {
  const [expanded, setExpanded] = useState(null);
  const [courseFilter, setCourseFilter] = useState("all");

  const { data: conversations = [] } = useQuery({
    queryKey: ["s-ai-history", user.email],
    queryFn: () => api.aiConversations.mine()
  });

  const filtered = courseFilter === "all" ? conversations : conversations.filter(c => c.course_id === courseFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>AI Learning History</h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Previous conversations with your AI course assistant</p>
      </div>

      {/* Course filter */}
      {enrollments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCourseFilter("all")}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: courseFilter === "all" ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", color: courseFilter === "all" ? "#a78bfa" : "#475569", border: `1px solid ${courseFilter === "all" ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.07)"}` }}>
            All Courses
          </button>
          {enrollments.map(e => (
            <button key={e.course_id} onClick={() => setCourseFilter(e.course_id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{ background: courseFilter === e.course_id ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", color: courseFilter === e.course_id ? "#a78bfa" : "#475569", border: `1px solid ${courseFilter === e.course_id ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.07)"}` }}>
              {e.course_title}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(conv => (
          <div key={conv.id} className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === conv.id ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.07)"}` }}>
            <button className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
              onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{conv.lesson_title || "AI Chat Session"}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
                      <BookOpen className="w-3 h-3" />{conv.course_title}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#334155" }}>
                      <Clock className="w-3 h-3" />{conv.created_date ? new Date(conv.created_date).toLocaleDateString() : ""}
                    </span>
                    <span className="text-xs" style={{ color: "#334155" }}>{conv.messages?.length || 0} messages</span>
                  </div>
                  {conv.summary && <p className="text-xs mt-1 line-clamp-1" style={{ color: "#334155" }}>{conv.summary}</p>}
                </div>
              </div>
              {expanded === conv.id ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} />}
            </button>

            {expanded === conv.id && conv.messages?.length > 0 && (
              <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
                  {conv.messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={msg.role === "user"
                          ? { background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.2)" }
                          : { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                        {msg.role === "user"
                          ? <span className="text-xs font-bold" style={{ color: "#60a5fa" }}>U</span>
                          : <Sparkles className="w-3 h-3 text-white" />}
                      </div>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                        style={msg.role === "user"
                          ? { background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                        {msg.role === "assistant"
                          ? <ReactMarkdown className="prose-xs" components={{ p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p> }}>{msg.content}</ReactMarkdown>
                          : msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
            <p className="text-base font-semibold text-white mb-1">No AI conversations yet</p>
            <p className="text-sm" style={{ color: "#334155" }}>Start chatting with the AI assistant while watching lessons</p>
          </div>
        )}
      </div>
    </div>
  );
}