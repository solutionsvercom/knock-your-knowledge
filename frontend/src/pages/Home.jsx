import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import HeroSection from "../components/home/HeroSection";
import InternshipsPreview from "../components/home/InternshipsPreview";
import CTASection from "../components/home/CTASection";
import FeaturesSection from "../components/home/FeaturesSection";
import LearningJourneySection from "../components/home/LearningJourneySection";
import HomeApplyPopup from "../components/home/HomeApplyPopup";
import { asArray } from "@/lib/asArray";

export default function Home() {
  const {
    data: internshipsRaw,
    isLoading: internshipsLoading,
    isError: internshipsError,
    error: internshipsErr,
    refetch: refetchInternships,
  } = useQuery({
    queryKey: ["internships-preview"],
    queryFn: async () => asArray(await api.internships.list()),
  });

  const internships = asArray(internshipsRaw);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <LearningJourneySection />
      <InternshipsPreview
        internships={internships}
        isLoading={internshipsLoading}
        isError={internshipsError}
        error={internshipsErr}
        onRetry={() => refetchInternships()}
      />
      <CTASection />
      <HomeApplyPopup />
    </div>
  );
}
