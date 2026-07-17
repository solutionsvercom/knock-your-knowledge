import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, ArrowLeft, BookOpen, Play, HelpCircle, Download, Users } from "lucide-react";
import CourseList from "./CourseList";
import CourseForm from "./CourseForm";
import LessonsTab from "./LessonsTab";
import QuizzesTab from "./QuizzesTab";
import ResourcesTab from "./ResourcesTab";
import EnrollmentTab from "./EnrollmentTab";

const TABS = [
  { id: "lessons", label: "Lessons", icon: Play },
  { id: "quizzes", label: "Quizzes", icon: HelpCircle },
  { id: "resources", label: "Resources", icon: Download },
  { id: "enrollment", label: "Enrollment", icon: Users },
];

export default function CourseManagement({ courses, enrollments, instructorName, isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [managingCourse, setManagingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons");

  const handleEdit = (course) => {
    setEditCourse(course);
    setShowForm(true);
    setManagingCourse(null);
  };

  const handleManage = (course) => {
    setManagingCourse(course);
    setShowForm(false);
    setActiveTab("lessons");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditCourse(null);
  };

  // Course detail / management view
  if (managingCourse) {
    return (
      <div className="space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setManagingCourse(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{managingCourse.title}</h2>
            <p className="text-xs" style={{ color: "#475569" }}>{managingCourse.instructor} · {managingCourse.category}</p>
          </div>
          <button onClick={() => handleEdit(managingCourse)}
            className="ml-auto px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>
            Edit Details
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab.id ? "rgba(167,139,250,0.2)" : "transparent",
                  color: activeTab === tab.id ? "#a78bfa" : "#475569",
                  border: activeTab === tab.id ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
                }}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "lessons" && <LessonsTab course={managingCourse} />}
          {activeTab === "quizzes" && <QuizzesTab course={managingCourse} />}
          {activeTab === "resources" && <ResourcesTab course={managingCourse} />}
          {activeTab === "enrollment" && <EnrollmentTab course={managingCourse} enrollments={enrollments} />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {isAdmin ? "Course Management" : "My Courses"}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{courses.length} courses</p>
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditCourse(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.3)" }}>
            <Plus className="w-4 h-4" /> New Course
          </button>
        )}
      </div>

      {showForm && (
        <CourseForm
          course={editCourse}
          onClose={handleCloseForm}
          instructorName={instructorName}
        />
      )}

      <CourseList
        courses={courses}
        enrollments={enrollments}
        onEdit={handleEdit}
        onManage={handleManage}
      />
    </div>
  );
}