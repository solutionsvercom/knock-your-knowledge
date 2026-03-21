import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Sparkles, BookOpen, Code, Calculator, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AITutorSection() {
  const features = [
    { icon: BookOpen, label: "Concept Explanation", desc: "Deep dive into any topic", color: "bg-blue-50 text-blue-600" },
    { icon: Code, label: "Code Assistance", desc: "Debug and learn coding", color: "bg-purple-50 text-purple-600" },
    { icon: Calculator, label: "Problem Solving", desc: "Math & logic solutions", color: "bg-green-50 text-green-600" },
    { icon: FileText, label: "Study Notes", desc: "AI-generated summaries", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Powered by Advanced AI</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Personal AI Tutor Available 24/7
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Get instant help with any topic. Our AI tutor explains concepts, solves problems, reviews your code, and creates personalized study materials.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feat) => (
                <div key={feat.label} className="p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center mb-3`}>
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{feat.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>

            <Link to={createPageUrl("AITutor")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-8 h-12 gap-2">
                Try AI Tutor Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right mock chat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/80 border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm dark:text-white">SkyBrisk AI Tutor</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Always here to help</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm">Explain React hooks in simple terms</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 max-w-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      React Hooks are special functions that let you 'hook into' React features. Think of them like power-ups for your components! 🚀
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-gray-600 dark:text-gray-400"><strong>useState</strong> - Gives your component memory</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400"><strong>useEffect</strong> - Runs code after render</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400"><strong>useContext</strong> - Shares data without props</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}