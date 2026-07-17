import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, Trash2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const EMPTY_Q = { question: "", options: ["", "", "", ""], correct_index: 0, explanation: "" };

export default function QuizzesTab({ course }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ ...EMPTY_Q, options: ["", "", "", ""] }]);
  const [expanded, setExpanded] = useState(null);

  const { data: quizzes = [] } = useQuery({
    queryKey: ["quizzes", course.id],
    queryFn: () => api.quizzes.listByCourse(course.id)
  });

  const createQuiz = useMutation({
    mutationFn: (d) => api.quizzes.create(d),
    onSuccess: () => { qc.invalidateQueries(["quizzes", course.id]); setShowForm(false); setTitle(""); setQuestions([{ ...EMPTY_Q, options: ["", "", "", ""] }]); }
  });
  const deleteQuiz = useMutation({
    mutationFn: (id) => api.quizzes.delete(id),
    onSuccess: () => qc.invalidateQueries(["quizzes", course.id])
  });

  const addQuestion = () => setQuestions(p => [...p, { ...EMPTY_Q, options: ["", "", "", ""] }]);
  const removeQuestion = (i) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const setQ = (i, field, val) => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  const setOption = (qi, oi, val) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? val : o) } : q));

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{quizzes.length} quizzes</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}>
          <Plus className="w-4 h-4" /> Create Quiz
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-2xl p-5 space-y-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.25)" }}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">New Quiz</h4>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <input placeholder="Quiz Title *" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#06b6d4" }}>Question {qi + 1}</span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(qi)} className="text-xs" style={{ color: "#f87171" }}><X className="w-3.5 h-3.5" /></button>
                  )}
                </div>
                <input placeholder="Question text *" value={q.question} onChange={e => setQ(qi, "question", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${qi}`} checked={q.correct_index === oi} onChange={() => setQ(qi, "correct_index", oi)}
                        className="w-4 h-4 flex-shrink-0 accent-cyan-500" />
                      <input placeholder={`Option ${oi + 1}`} value={opt} onChange={e => setOption(qi, oi, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none" style={inputStyle} />
                    </div>
                  ))}
                </div>
                <input placeholder="Explanation (optional)" value={q.explanation} onChange={e => setQ(qi, "explanation", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}>
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
            <button onClick={() => createQuiz.mutate({ course_id: course.id, course_title: course.title, title, questions })}
              disabled={!title || questions.some(q => !q.question) || createQuiz.isPending}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}>
              {createQuiz.isPending ? "Saving…" : "Save Quiz"}
            </button>
          </div>
        </div>
      )}

      {/* Quiz list */}
      <div className="space-y-3">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <button className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => setExpanded(expanded === quiz.id ? null : quiz.id)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(6,182,212,0.15)" }}>
                  <HelpCircle className="w-4 h-4" style={{ color: "#06b6d4" }} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{quiz.title}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{quiz.questions?.length || 0} questions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); deleteQuiz.mutate(quiz.id); }}
                  className="p-1.5 rounded-lg transition-all" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === quiz.id ? <ChevronUp className="w-4 h-4" style={{ color: "#475569" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#475569" }} />}
              </div>
            </button>
            {expanded === quiz.id && quiz.questions?.length > 0 && (
              <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {quiz.questions.map((q, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-sm font-medium text-white mb-2">{i + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.options?.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs"
                          style={{ background: oi === q.correct_index ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)", color: oi === q.correct_index ? "#34d399" : "#64748b", border: `1px solid ${oi === q.correct_index ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.04)"}` }}>
                          {oi === q.correct_index && "✓ "}{opt}
                        </div>
                      ))}
                    </div>
                    {q.explanation && <p className="text-xs mt-2 italic" style={{ color: "#475569" }}>{q.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {quizzes.length === 0 && !showForm && (
          <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No quizzes yet</p>
        )}
      </div>
    </div>
  );
}