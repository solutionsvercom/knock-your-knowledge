import React from "react";
import { motion } from "framer-motion";

const companies = ["Google", "Microsoft", "Amazon", "Facebook", "Apple", "Netflix", "Spotify", "Uber"];

export default function CompaniesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Trusted By Industry Leaders</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Our Students Work At</h2>
        </div>

        {/* Scrolling logos */}
        <div className="relative">
          <div className="flex gap-12 animate-marquee">
            {[...companies, ...companies].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center"
              >
                <span className="text-xl font-bold text-gray-300 dark:text-gray-700">{name[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { value: "500+", label: "Partner Companies" },
            { value: "95%", label: "Placement Rate" },
            { value: "$85K", label: "Avg. Starting Salary" },
            { value: "30+", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}