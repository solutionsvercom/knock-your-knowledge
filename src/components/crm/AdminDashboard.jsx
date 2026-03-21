import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { BarChart2, Users, BookOpen, DollarSign, TicketCheck, UserCheck, Layers, Shield } from "lucide-react";
import CRMLayout from "./CRMLayout";
import OverviewSection from "./admin/OverviewSection";
import StudentsSection from "./admin/StudentsSection";
import CoursesSection from "./admin/CoursesSection";
import TeachersSection from "./admin/TeachersSection";
import PaymentsSection from "./admin/PaymentsSection";
import TicketsSection from "./admin/TicketsSection";
import LearningAnalytics from "./analytics/LearningAnalytics";
import BundlesSection from "./admin/BundlesSection";
import UsersSection from "./admin/UsersSection";

const NAV = [
  { id: "overview", label: "Overview", icon: BarChart2, default: true },
  { id: "users", label: "Users", icon: Shield },
  { id: "students", label: "Students", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "bundles", label: "Bundles", icon: Layers },
  { id: "teachers", label: "Teachers", icon: UserCheck },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "tickets", label: "Support Tickets", icon: TicketCheck },
  { id: "analytics", label: "Learning Analytics", icon: BarChart2 },
];

export default function AdminDashboard({ user }) {
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "overview");

  // Listen to hash changes
  useEffect(() => {
    const handler = () => setHash(window.location.hash.replace("#", "") || "overview");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const { data: users = [] } = useQuery({ queryKey: ["crm-users"], queryFn: () => api.users.list() });
  const { data: courses = [] } = useQuery({ queryKey: ["crm-courses"], queryFn: () => api.courses.list("-createdAt") });
  const { data: payments = [] } = useQuery({ queryKey: ["crm-payments"], queryFn: () => api.payments.list() });
  const { data: tickets = [] } = useQuery({ queryKey: ["crm-tickets"], queryFn: () => api.supportTickets.list() });
  const { data: enrollments = [] } = useQuery({ queryKey: ["crm-enrollments"], queryFn: () => api.enrollments.list() });
  const { data: bundles = [] } = useQuery({ queryKey: ["crm-bundles"], queryFn: () => api.bundles.list("-createdAt") });

  const students = users.filter(u => u.role === "student" || !u.role);
  const teachers = users.filter(u => u.role === "teacher");

  return (
    <CRMLayout user={user} navItems={NAV} accentColor="#a78bfa" roleLabel="Admin">
      {hash === "overview" && <OverviewSection users={users} courses={courses} payments={payments} tickets={tickets} enrollments={enrollments} />}
      {hash === "users" && <UsersSection users={users} />}
      {hash === "students" && <StudentsSection students={students} enrollments={enrollments} payments={payments} />}
      {hash === "courses" && <CoursesSection courses={courses} teachers={teachers} />}
      {hash === "bundles" && <BundlesSection bundles={bundles} />}
      {hash === "teachers" && <TeachersSection teachers={teachers} courses={courses} enrollments={enrollments} />}
      {hash === "payments" && <PaymentsSection payments={payments} />}
      {hash === "tickets" && <TicketsSection tickets={tickets} users={users} />}
      {hash === "analytics" && <LearningAnalytics isAdmin={true} />}
    </CRMLayout>
  );
}