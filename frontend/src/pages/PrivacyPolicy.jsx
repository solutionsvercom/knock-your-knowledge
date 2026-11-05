import React from "react";
import { Link } from "react-router-dom";
import { seoForPath } from "@/config/seo";
import { CONTACT_EMAIL } from "@/config/contact";

const pageSeo = seoForPath("/PrivacyPolicy");

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="py-16 border-b"
        style={{
          borderColor: "rgba(167,139,250,0.15)",
          background: "linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            Legal
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {pageSeo.h1}
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            How Knock Your Knowledge (KYK) collects, uses, and protects information on this website.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Who we are
          </h2>
          <p>
            Knock Your Knowledge (KYK) operates{" "}
            <Link to="/" className="underline" style={{ color: "#a78bfa" }}>
              knockyourknowledge.com
            </Link>
            . This Privacy Policy explains how we handle personal information when you browse the site, submit enquiry
            or application forms, create an account, enrol in a course or programme, or contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Information we collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-white font-medium">Contact and application details</span> — such as name, email,
              phone number, and message content when you use Get Started, Apply Now, or other contact forms.
            </li>
            <li>
              <span className="text-white font-medium">Account details</span> — email and authentication information
              when you sign up or sign in as a student.
            </li>
            <li>
              <span className="text-white font-medium">Enrolment and payment details</span> — product selections, order
              references, and payment status. Card and UPI payments are processed by our payment partner (Cashfree);
              KYK does not store full card numbers on this website.
            </li>
            <li>
              <span className="text-white font-medium">Support messages</span> — information you send through tickets
              or support-related forms.
            </li>
            <li>
              <span className="text-white font-medium">Technical data</span> — basic logs such as IP address, browser
              type, and pages requested that help us run and secure the site. Analytics tools (such as Google Analytics)
              may collect usage statistics when enabled.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            How we use information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Respond to enquiries and internship or course applications</li>
            <li>Create and manage student accounts and enrolments</li>
            <li>Process payments and send related confirmations</li>
            <li>Provide access to enrolled course content and live-class schedules</li>
            <li>Improve site reliability, security, and support</li>
            <li>Comply with legal or regulatory requirements where applicable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Sharing with service providers
          </h2>
          <p className="mb-3">
            We use trusted providers to operate the site. They process data only as needed to provide their services,
            for example:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Hosting and infrastructure</li>
            <li>Payment processing (Cashfree)</li>
            <li>Email delivery for transactional messages</li>
            <li>Media delivery for course videos (where used)</li>
            <li>Analytics, when configured</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information. We may disclose information if required by law or to protect the
            rights, safety, or integrity of KYK, our users, or the public.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Data security and retention
          </h2>
          <p>
            We take reasonable technical and organisational steps to protect personal information. No method of
            transmission or storage is completely secure. We keep information for as long as needed to provide services,
            meet legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Your choices
          </h2>
          <p>
            You may request access to, correction of, or deletion of personal information we hold about you, subject to
            legal and operational limits (for example, records needed for payments or compliance). Contact us using the
            details below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Children
          </h2>
          <p>
            KYK programmes and courses are aimed at students and professionals. If you believe we have collected
            information from a child without appropriate consent, contact us and we will take reasonable steps to
            address it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Updates to this policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page. Please
            review it periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Contact
          </h2>
          <p>
            For privacy-related questions, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "#a78bfa" }}>
              {CONTACT_EMAIL}
            </a>
            . You can also read our{" "}
            <Link to="/WorkplacePolicy" className="underline" style={{ color: "#a78bfa" }}>
              Hybrid Workplace Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
