import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { downloadReport } from "../../lib/services/reportService";

type ReportType = "applications" | "events" | "progress" | "mentors";

interface ReportItem {
  title: string;
  desc: string;
  type: ReportType;
}

type CardProps = { children: React.ReactNode; className?: string };

function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-sky-50 via-white to-indigo-50 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl ${className || ""}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }: CardProps) {
  return <div className="mb-3">{children}</div>;
}

function CardTitle({ children }: CardProps) {
  return <h3 className="text-lg font-semibold text-slate-800">{children}</h3>;
}

function CardContent({ children }: CardProps) {
  return <div>{children}</div>;
}

const Reports: React.FC = () => {
  const handleDownload = async (type: ReportType) => {
    try {
      await downloadReport(type);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report. Please try again.");
    }
  };

  const reportItems: ReportItem[] = [
    {
      title: "Applications Report",
      desc: "Detailed list of all student applications with their current status.",
      type: "applications",
    },
    {
      title: "Events Report",
      desc: "Track event participation, attendance, and engagement.",
      type: "events",
    },
    {
      title: "Student Progress Report",
      desc: "Overview of students by incubation stage and their progression.",
      type: "progress",
    },
    {
      title: "Mentor Allocation Report",
      desc: "Shows how mentors are assigned to students and their workloads.",
      type: "mentors",
    },
  ];

  const insights = [
    {
      front: "💡 Applications Growth",
      back: "Student applications increased by 40% this quarter. Consider onboarding more mentors.",
    },
    {
      front: "📈 Incubation Progress",
      back: "Review student progress monthly to ensure timely promotion through stages.",
    },
    {
      front: "🧩 Pre-incubation",
      back: "Ensure pre-incubation students complete their tasks before advancing.",
    },
    {
      front: "⚠️ Event Engagement",
      back: "Add gamified sessions or rewards to increase event engagement.",
    },
    {
      front: "📊 Reporting",
      back: "Regularly export reports for quarterly reviews and stakeholder updates.",
    },
    {
      front: "👨‍🏫 Mentorship Load",
      back: "Balance mentor loads by redistributing students evenly.",
    },
    {
      front: "🔍 Engagement Gaps",
      back: "Analyze correlations between event participation and application quality.",
    },
    {
      front: "💬 Feedback Collection",
      back: "Gather student feedback after each event to improve satisfaction rates.",
    },
    {
      front: "🚀 Success Metrics",
      back: "Track startups that graduate incubation successfully to measure impact.",
    },
  ];

  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports Dashboard</h2>
        <p className="text-sm text-slate-500">
          Generate and export detailed reports on student applications, events,
          mentor allocation, and incubation progress.
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportItems.map((report, i) => (
          <motion.div
            key={report.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <p className="text-sm text-slate-600">{report.desc}</p>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => handleDownload(report.type)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition w-full sm:w-auto"
                >
                  Download CSV
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights / Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <p className="text-sm text-slate-500">
              Tap or click a card to reveal actionable insights for improving
              student engagement and incubation performance.
            </p>
          </CardHeader>

          {/* Flip Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                className="relative w-full h-40 cursor-pointer perspective"
                onClick={() => setFlipped(flipped === index ? null : index)}
              >
                <AnimatePresence initial={false}>
                  {flipped !== index ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: -180 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 text-white rounded-2xl shadow-md backface-hidden"
                    >
                      <p className="text-center text-sm font-medium px-3">
                        {insight.front}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -180 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center bg-white text-slate-700 rounded-2xl shadow-md backface-hidden border border-slate-200 p-4"
                    >
                      <p className="text-center text-sm font-medium">
                        {insight.back}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
