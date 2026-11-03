import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import GetStartedLink from "@/components/navigation/GetStartedLink";
import { whatsappGetStartedUrl } from "@/config/contact";
import { seoForPath } from "@/config/seo";

const pageSeo = seoForPath("/");

const TRACKS = [
  { to: "/Internships/development", text: "Development Internship" },
  { to: "/Internships/ai", text: "AI & Prompt Engineering Internship" },
  { to: "/Internships/analytics", text: "Business Analytics Internship" },
  { to: "/Internships/marketing", text: "Advanced Digital Marketing Internship" },
];

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.45 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.94 11.94 0 005.8 1.48h.01c6.6 0 11.95-5.35 11.95-11.94 0-3.19-1.24-6.19-3.5-8.42zM12.07 21.85h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.72.98.99-3.62-.24-.37a9.86 9.86 0 01-1.51-5.29c0-5.44 4.43-9.87 9.88-9.87 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.98c0 5.44-4.43 9.88-9.87 9.88zm5.41-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}

function NeuralCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const layers = [3, 5, 6, 5, 3];
    const nodes = [];
    layers.forEach((count, li) => {
      const x = (W / (layers.length + 1)) * (li + 1);
      for (let ni = 0; ni < count; ni++) {
        const y = (H / (count + 1)) * (ni + 1);
        nodes.push({ x, y, layer: li, phase: Math.random() * Math.PI * 2 });
      }
    });

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      nodes.forEach((a) => {
        nodes.forEach((b) => {
          if (b.layer !== a.layer + 1) return;
          const pulse = (Math.sin(t * 2.5 + a.phase) + 1) / 2;
          const alpha = 0.06 + pulse * 0.22;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
          grad.addColorStop(1, `rgba(59,130,246,${alpha})`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      });
      nodes.forEach((n) => {
        const pulse = (Math.sin(t * 2 + n.phase) + 1) / 2;
        const r = 5 + pulse * 4.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233,213,255,${0.7 + pulse * 0.2})`;
        ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden />;
}

export default function HeroSection() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <section
      className="relative z-0 min-h-screen overflow-hidden flex items-center"
      style={{ background: "linear-gradient(135deg, #020817 0%, #0f0a2e 30%, #1a0a3e 60%, #0d1b4b 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center min-h-[88vh]">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#a78bfa" }}>
              Knock Your Knowledge (KYK)
            </p>
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-white mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {pageSeo.h1}
            </h1>
            <h2 className="text-lg lg:text-xl font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Paid, real-time internships in Development, AI, Analytics and Digital Marketing
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: "#94a3b8" }}>
              KYK publishes four paid, real-time internship programmes. Courses and course bundles are separate products
              on the same tracks. The intern pays the programme fee to KYK — it is not a stipend or salary.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <GetStartedLink
                className="relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base min-h-[52px]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)",
                  boxShadow: "0 0 24px rgba(124,58,237,0.55)",
                  border: "1px solid rgba(167,139,250,0.4)",
                }}
              >
                <Zap className="w-4 h-4" />
                Get Started
                <ArrowRight className="w-4 h-4" />
              </GetStartedLink>

              <Link
                to="/Internships"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base min-h-[52px]"
                style={{
                  background: "rgba(6,182,212,0.08)",
                  border: "1px solid rgba(6,182,212,0.45)",
                  color: "#67e8f9",
                }}
              >
                Explore internships
              </Link>

              <Link
                to="/Courses"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base min-h-[52px]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e2e8f0",
                }}
              >
                Explore Courses
              </Link>

              <a
                href={whatsappGetStartedUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base min-h-[52px]"
                style={{
                  background: "linear-gradient(135deg, #25d366, #128c7e)",
                  border: "1px solid rgba(37,211,102,0.55)",
                }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {TRACKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div
              className="relative w-[340px] h-[340px] lg:w-[400px] lg:h-[400px] rounded-3xl overflow-hidden border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(139,92,246,0.35)",
                boxShadow: "0 0 70px rgba(124,58,237,0.35)",
              }}
            >
              {!isMobile && <NeuralCanvas />}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3" style={{ background: "rgba(0,0,0,0.55)" }}>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  Four paid internship tracks
                </p>
                <p className="text-sm font-bold text-white">Development · AI · Analytics · Marketing</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
