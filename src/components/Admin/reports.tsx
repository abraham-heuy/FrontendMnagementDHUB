import React from "react";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";

// Reusable Card components
type CardProps = { children: React.ReactNode; className?: string };
function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>
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

// CSV generator
const generateCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, filename);
};

// Sample report data
const sampleApplications = [
  { studentName: "Alice Johnson", event: "Startup Pitch", status: "Approved" },
  { studentName: "Bob Smith", event: "Hackathon", status: "Pending" },
];

const sampleEvents = [
  { eventName: "Startup Pitch", attendees: 45, date: "2025-08-01" },
  { eventName: "Hackathon", attendees: 30, date: "2025-08-15" },
];

const sampleProgress = [
  { studentName: "Alice Johnson", stage: "Incubation" },
  { studentName: "Bob Smith", stage: "Pre-incubation" },
];

const sampleMentorAllocation = [
  { mentor: "John Doe", studentsAssigned: 5 },
  { mentor: "Jane Smith", studentsAssigned: 4 },
];

const Reports: React.FC = () => {
  return (
    <div className="p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Reports Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Generate and export detailed reports on student applications, events, mentor allocation, and incubation progress.
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/** Applications Report */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Applications Report</CardTitle>
              <p className="text-sm text-slate-500">
                Detailed list of all student applications with their current status.
              </p>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => generateCSV(sampleApplications, "applications_report.csv")}
                className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
              >
                Download CSV
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/** Events Report */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Events Report</CardTitle>
              <p className="text-sm text-slate-500">
                Track event participation, attendance, and overall engagement.
              </p>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => generateCSV(sampleEvents, "events_report.csv")}
                className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
              >
                Download CSV
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/** Student Progress Report */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Report</CardTitle>
              <p className="text-sm text-slate-500">
                Overview of students by incubation stage and their progression.
              </p>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => generateCSV(sampleProgress, "progress_report.csv")}
                className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
              >
                Download CSV
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/** Mentor Allocation Report */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Mentor Allocation Report</CardTitle>
              <p className="text-sm text-slate-500">
                Shows how mentors are assigned to students based on stages and workloads.
              </p>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => generateCSV(sampleMentorAllocation, "mentor_allocation_report.csv")}
                className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
              >
                Download CSV
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/** Insights / Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
              <p className="text-sm text-slate-500">
                Actionable advice based on reports to improve student engagement and incubation success.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>💡 Student applications increased by 40% this quarter. Consider onboarding more mentors.</li>
                <li>💡 Review progress of students in incubation stage monthly to ensure timely promotion.</li>
                <li>💡 Ensure pre-incubation students complete required pre-incubation tasks before advancing.</li>
                <li>⚠️ Event attendance below target? Organize interactive sessions or incentives to boost participation.</li>
                <li>💡 Exported reports can be shared with stakeholders to support strategic planning and decision making.</li>
                <li>💡 Average mentor allocation should not exceed 6 students per mentor to maintain quality guidance.</li>
                <li>💡 Track student applications vs. event participation to identify engagement gaps.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
