import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getDashboardSummary, type DashboardSummary } from "../../lib/services/analyticsServvice";


// Reusable card components
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition ${className}`}>
      {children}
    </div>
  );
}
const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3">{children}</div>
);
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

const Analytics = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch analytics data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardSummary();
        setData(response);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data
  const userDistribution =
    data?.users?.usersByRole?.map((r) => ({
      name: r.role,
      value: Number(r.count),
    })) || [];

  const stageDistribution =
    data?.stages?.stageDistribution?.map((s) => ({
      name: s.stage,
      value: Number(s.count),
    })) || [];

  const mentorRatio = [
    {
      group: "Mentorship",
      ratio: Number(data?.mentors?.mentorStudentRatio || 0),
    },
  ];

  // ✅ Dynamic insights
  const suggestions = [];
  if (data) {
    const { users, stages, events, mentors, notifications } = data;

    // Engagement suggestion
    if (users.newRegistrations > 10)
      suggestions.push(
        `📈 User engagement is rising — ${users.newRegistrations} new users joined this week. Keep up community outreach.`
      );

    // Mentor ratio suggestion
    if (Number(mentors.mentorStudentRatio) < 3)
      suggestions.push(
        `⚠️ Mentor-to-student ratio is low (${mentors.mentorStudentRatio}:1). Consider adding more mentors.`
      );

    // Stage completion suggestion
    const avgProgress =
      stages.completionRates?.reduce((sum, s) => sum + Number(s.averageProgress || 0), 0) /
      (stages.completionRates?.length || 1);
    if (avgProgress < 60)
      suggestions.push(
        `💡 Average stage completion is ${avgProgress.toFixed(
          1
        )}%. Consider additional workshops or motivation campaigns.`
      );

    // Event engagement suggestion
    if (events.totalApplications > 50)
      suggestions.push(
        `📊 ${events.totalApplications} event applications recorded — strong interest in events.`
      );

    // Notification health
    if (notifications.totalNotifications > 100)
      suggestions.push(`✅ System is active — over 100 notifications sent recently.`);
  }

  if (loading) return <p className="text-center text-gray-500 py-10">Loading analytics...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-sm text-gray-500">
          Track progress, applications, mentorship, and system activity.
        </p>
      </div>

      {/* Users Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <p className="text-sm text-gray-500">
              Breakdown of all users by their roles in the system.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {userDistribution.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4">
                {userDistribution.map((user, idx) => {
                  const total = userDistribution.reduce((sum, u) => sum + u.value, 0);
                  const percent = ((user.value / total) * 100).toFixed(1);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-xl text-center shadow-sm"
                    >
                      <p className="text-xl font-bold text-gray-800">{user.value}</p>
                      <p className="text-sm text-gray-500">{user.name}</p>
                      <p className="text-xs text-gray-400">{percent}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stage Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Stage Progress Distribution</CardTitle>
            <p className="text-sm text-gray-500">
              Student participation and stage completion levels.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mentor Ratios */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Mentor-to-Student Ratios</CardTitle>
            <p className="text-sm text-gray-500">
              Shows current mentorship load per student.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mentorRatio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights & Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Insights & Suggestions</CardTitle>
            <p className="text-sm text-gray-500">
              Automatically generated recommendations based on live data trends.
            </p>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No major trends detected yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
