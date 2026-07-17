import React, { useState, useRef, useEffect } from "react";
import { api } from "@/api/apiClient";
import { Send, Sparkles, Loader2, Bot, User, ExternalLink, Clock, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import ReactMarkdown from "react-markdown";

const SUGGESTION_SETS = [
  ["Explain this concept simply", "Give me a real-world example", "What should I focus on here?"],
  ["Generate a practice question", "Summarize what I just learned", "What are common mistakes here?"],
  ["Show me a code example", "How does this relate to real projects?", "Quiz me on this topic"],
  ["Break this down step by step", "What's the key takeaway?", "Compare with a simpler concept"],
];

export default function AIChat({ lesson, course, videoTimeRef }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! 👋 I'm your AI Course Assistant. I'm here to help you understand **${lesson?.title || "this lesson"}**.\n\nFeel free to ask me anything — concepts, examples, or code explanations!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionSet, setSuggestionSet] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat when course changes
  useEffect(() => {
    if (!course?.id) return;
    setMessages([{
      role: "assistant",
      content: `👨‍🏫 I'm now your dedicated **${course?.title || course?.category}** teacher!\n\nI'll only answer questions related to **${course?.category || course?.title}**${course?.tags?.length ? ` (${course.tags.slice(0,3).join(", ")})` : ""}.\n\nCurrently on: **${lesson?.title}** — ask me anything about this lesson!`,
    }]);
  }, [course?.id]);

  // Reset chat when lesson changes (within same course)
  useEffect(() => {
    if (!lesson?.id || !course?.id) return;
    setMessages(prev => {
      // Only reset if this isn't the first load (course change already handled above)
      if (prev.length === 0) return prev;
      return [{
        role: "assistant",
        content: `📖 Switched to **${lesson?.title}**!\n\n${lesson?.description || ""}\n\nWhat would you like to understand about this lesson?`,
      }];
    });
  }, [lesson?.id]);

  // Rotate suggestions every 30s to keep them fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionSet(prev => (prev + 1) % SUGGESTION_SETS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reset suggestions on lesson change
  useEffect(() => {
    setSuggestionSet(0);
  }, [lesson?.id]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const timestamp = videoTimeRef?.current > 0 ? videoTimeRef.current : null;
    const userMsg = { role: "user", content: text, timestamp };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are a dedicated subject teacher for the course: "${course?.title || lesson?.title || "this course"}".
Your ONLY job is to teach topics related to this course subject: ${course?.category || course?.title || "the enrolled course"}.
${course?.tags?.length ? `Core topics you cover: ${course.tags.join(", ")}.` : ""}
Current lesson: "${lesson?.title}" — ${lesson?.description || ""}${userMsg.timestamp != null ? `\nThe student is asking at video timestamp ${fmtTime(userMsg.timestamp)} in this lesson. Use this as context for what they might be watching/learning at that moment.` : ""}

Your role:
- Explain concepts clearly with simple language and analogies
- Provide code examples when relevant (use markdown code blocks)
- Be encouraging and supportive like a great teacher
- Keep responses concise but thorough
- Use emojis sparingly to keep it engaging
- You only teach topics strictly within this course's subject area`;

    // First check if the question is relevant to the course
    const courseSubject = course?.category || course?.title || lesson?.title || "this course";
    const courseTags = course?.tags?.join(", ") || "";

    const relevanceCheck = await api.ai.invokeLLM({
      prompt: `You are a course relevance checker. The student is enrolled in a course about: "${courseSubject}"${courseTags ? ` (topics: ${courseTags})` : ""}.

The student asked: "${text}"

Determine if this question is directly related to the course subject or a closely related subtopic within it.
Respond ONLY with a JSON object like:
{"relevant": true} or {"relevant": false, "topic": "detected topic from the question"}

Do not explain anything, just return the JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          relevant: { type: "boolean" },
          topic: { type: "string" }
        },
        required: ["relevant"]
      }
    });

    if (!relevanceCheck.relevant) {
      const offTopic = relevanceCheck.topic || "that topic";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `__off_topic__`,
        offTopic,
        courseSubject,
      }]);
      setLoading(false);
      return;
    }

    // Special handler for practice questions
    const isPracticeRequest = /generate.*practice|practice question|quiz me/i.test(text);
    if (isPracticeRequest) {
      const questions = await api.ai.invokeLLM({
        prompt: `You are a teacher for the course "${course?.title}" on the lesson "${lesson?.title}".
Generate exactly 3 practice questions strictly about this lesson topic: "${lesson?.title}" — ${lesson?.description || ""}.

Return a JSON object with these 3 questions:
1. conceptual: A conceptual understanding question (open-ended)
2. practical: A coding or hands-on practical question
3. mcq: A multiple-choice question with 4 options (a, b, c, d) and the correct answer key

Keep questions concise and directly tied to the lesson content.`,
        response_json_schema: {
          type: "object",
          properties: {
            conceptual: { type: "string" },
            practical: { type: "string" },
            mcq: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "object", properties: { a: { type: "string" }, b: { type: "string" }, c: { type: "string" }, d: { type: "string" } } },
                answer: { type: "string" }
              }
            }
          },
          required: ["conceptual", "practical", "mcq"]
        }
      });
      setMessages(prev => [...prev, { role: "assistant", content: "__practice__", questions }]);
      setLoading(false);
      return;
    }

    const response = await api.ai.invokeLLM({
      prompt: `${systemPrompt}\n\nStudent asks: ${text}`,
    });

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-96 flex-shrink-0 flex flex-col border-l"
      style={{ background: "rgba(2,4,15,0.95)", borderColor: "rgba(167,139,250,0.15)" }}>

      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "rgba(167,139,250,0.12)", background: "rgba(124,58,237,0.06)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>AI Course Assistant</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: "#34d399" }}>Ready to help</span>
          </div>
        </div>
      </div>

      {/* Course + Lesson context chip */}
      <div className="px-4 py-2.5 border-b space-y-1.5" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}>
          <Bot className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
          <span className="text-xs truncate" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
            Course: <span style={{ color: "#60a5fa", fontWeight: 600 }}>{course?.title || "—"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}>
          <Bot className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#a78bfa" }} />
          <span className="text-xs truncate" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
            Lesson: <span style={{ color: "#a78bfa" }}>{lesson?.title}</span>
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
              style={msg.role === "assistant"
                ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 10px rgba(124,58,237,0.4)" }
                : { background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.25)" }}>
              {msg.role === "assistant"
                ? <Sparkles className="w-3.5 h-3.5 text-white" />
                : <User className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />}
            </div>

            {/* Bubble */}
            {msg.content === "__practice__" ? (
              <div className="max-w-[82%] rounded-2xl rounded-tl-sm px-4 py-3 space-y-3"
                style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🎯</span>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#34d399" }}>Practice Questions</p>
                </div>
                {/* Conceptual */}
                <div className="rounded-xl p-3 space-y-1" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#60a5fa" }}>💭 Conceptual</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1", fontFamily: "'Inter', sans-serif" }}>{msg.questions?.conceptual}</p>
                </div>
                {/* Practical */}
                <div className="rounded-xl p-3 space-y-1" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>💻 Practical</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1", fontFamily: "'Inter', sans-serif" }}>{msg.questions?.practical}</p>
                </div>
                {/* MCQ */}
                {msg.questions?.mcq && (
                  <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#fbbf24" }}>🔘 Multiple Choice</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1", fontFamily: "'Inter', sans-serif" }}>{msg.questions.mcq.question}</p>
                    <div className="space-y-1 mt-2">
                      {Object.entries(msg.questions.mcq.options || {}).map(([key, val]) => (
                        <div key={key} className="flex items-start gap-2 text-xs px-2 py-1.5 rounded-lg"
                          style={{
                            background: key === msg.questions.mcq.answer ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.03)",
                            border: key === msg.questions.mcq.answer ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.05)",
                            color: key === msg.questions.mcq.answer ? "#34d399" : "#94a3b8",
                          }}>
                          <span className="font-bold uppercase">{key}.</span>
                          <span>{val}</span>
                          {key === msg.questions.mcq.answer && <span className="ml-auto text-xs">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : msg.content === "__off_topic__" ? (
              <div className="max-w-[82%] rounded-2xl rounded-tl-sm px-4 py-3 space-y-3"
                style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.25)" }}>
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">🚫</span>
                  <p className="text-sm leading-relaxed" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>
                    This question is outside the current course.{" "}
                    <span style={{ color: "#e2e8f0" }}>To learn about <strong style={{ color: "#fb923c" }}>{msg.offTopic}</strong>, you can explore our dedicated course.</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-px flex-1" style={{ background: "rgba(251,146,60,0.15)" }} />
                  <span className="text-xs" style={{ color: "#475569" }}>Suggested</span>
                  <div className="h-px flex-1" style={{ background: "rgba(251,146,60,0.15)" }} />
                </div>
                <Link to={createPageUrl("Courses")}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.35)", color: "#fb923c" }}>
                  <ExternalLink className="w-3.5 h-3.5" />
                  View {msg.offTopic} Course
                </Link>
                <p className="text-xs text-center" style={{ color: "#334155" }}>
                  I'm dedicated to helping you master <span style={{ color: "#a78bfa" }}>{msg.courseSubject}</span> 🎯
                </p>
              </div>
            ) : (
              <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 14px rgba(59,130,246,0.2)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {msg.role === "user" ? (
                  <div>
                    {msg.timestamp != null && (
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <Clock className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                        <span className="text-xs font-mono font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                          {fmtTime(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-white leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{msg.content}</p>
                  </div>
                ) : (
                  <ReactMarkdown
                    className="text-sm leading-relaxed prose-sm max-w-none"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>{children}</p>,
                      strong: ({ children }) => <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>{children}</strong>,
                      code: ({ inline, children }) => inline
                        ? <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", fontFamily: "monospace" }}>{children}</code>
                        : <pre className="mt-2 p-3 rounded-xl overflow-x-auto text-xs" style={{ background: "rgba(0,0,0,0.4)", color: "#c4b5fd", fontFamily: "monospace" }}><code>{children}</code></pre>,
                      ul: ({ children }) => <ul className="ml-4 mb-2 space-y-1" style={{ color: "#94a3b8", listStyleType: "disc" }}>{children}</ul>,
                      li: ({ children }) => <li className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{children}</li>,
                    }}>
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#a78bfa", animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Smart AI Suggestions */}
      {!loading && (
        <div className="px-4 pb-3 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3 h-3" style={{ color: "#fbbf24" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Suggestions</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SUGGESTION_SETS[suggestionSet].map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] hover:brightness-110"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.18)", color: "#a78bfa", fontFamily: "'Inter', sans-serif" }}>
                💡 {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-end gap-2 rounded-xl p-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about this lesson…"
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none py-1 px-2 max-h-24"
            style={{ color: "#e2e8f0", fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: input.trim() ? "0 0 14px rgba(124,58,237,0.5)" : "none" }}>
            {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "#1e293b" }}>Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}