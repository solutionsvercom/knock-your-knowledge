import React from "react";

const workplaces = [
  "Travel Companies",
  "Hospitals",
  "Play Schools",
  "Tech Companies",
  "Career Platforms",
  "Restaurants",
  "Gyms",
  "Retail Brands",
];

export default function CompaniesSection() {
  const track = [...workplaces, ...workplaces];

  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Trusted Across Industries
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Our Students Work At
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Travel companies, hospitals, play schools, tech companies, career platforms, restaurants, gyms, and more.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee — outside max-width so cards scroll edge to edge */}
      <div className="relative w-full overflow-hidden group">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10"
          style={{ background: "linear-gradient(90deg, #fff 0%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 dark:hidden"
          style={{ background: "linear-gradient(270deg, #fff 0%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 hidden dark:block"
          style={{ background: "linear-gradient(90deg, #030712 0%, transparent 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 hidden dark:block"
          style={{ background: "linear-gradient(270deg, #030712 0%, transparent 100%)" }}
        />

        <div className="flex w-max gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] py-2">
          {track.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex-shrink-0 min-w-[180px] sm:min-w-[200px] h-16 px-5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 text-center whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          {[
            { value: "25+", label: "Partner Companies" },
            { value: "100%", label: "Placement Assistance" },
            { value: "10+", label: "States" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
