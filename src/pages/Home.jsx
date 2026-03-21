import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import HeroSection from "../components/home/HeroSection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import AITutorSection from "../components/home/AITutorSection";
import InternshipsPreview from "../components/home/InternshipsPreview";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CompaniesSection from "../components/home/CompaniesSection";
import CTASection from "../components/home/CTASection";
import FeaturesSection from "../components/home/FeaturesSection";
import LearningJourneySection from "../components/home/LearningJourneySection";
import GamificationSection from "../components/home/GamificationSection";
import AISkillGenerator from "../components/home/AISkillGenerator";
import { asArray } from "@/lib/asArray";

export default function Home() {
  const {
    data: coursesRaw,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErr,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.courses.list("-rating", 3),
  });

  const {
    data: internshipsRaw,
    isLoading: internshipsLoading,
    isError: internshipsError,
    error: internshipsErr,
    refetch: refetchInternships,
  } = useQuery({
    queryKey: ["internships-preview"],
    queryFn: async () => {
      const rows = asArray(await api.internships.list());
      return rows.slice(0, 3);
    },
  });

  const courses = asArray(coursesRaw);
  const internships = asArray(internshipsRaw);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <LearningJourneySection />
      <GamificationSection />
      <FeaturedCourses
        courses={courses}
        isLoading={coursesLoading}
        isError={coursesError}
        error={coursesErr}
        onRetry={() => refetchCourses()}
      />
      <AISkillGenerator />
      <AITutorSection />
      <InternshipsPreview
        internships={internships}
        isLoading={internshipsLoading}
        isError={internshipsError}
        error={internshipsErr}
        onRetry={() => refetchInternships()}
      />
      <TestimonialsSection />
      <CompaniesSection />
      <CTASection />
    </div>
  );
}