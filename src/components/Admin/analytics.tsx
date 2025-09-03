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

// Simple reusable Card
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition ${className || ""}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }: CardProps) {
  return <div className="mb-3">{children}</div>;
}

function CardTitle({ children }: CardProps) {
  return (
    <h3 className="text-lg font-semibold text-gray-900">
      {children}
    </h3>
  );
}

function CardContent({ children }: CardProps) {
  return <div>{children}</div>;
}

// Sample data
const userDistribution = [
  { name: "Students", value: 400 },
  { name: "Mentors", value: 80 },
  { name: "Staff", value: 40 },
];

const studentActivity = [
  { month: "Jan", applications: 120, events: 10 },
  { month: "Feb", applications: 90, events: 14 },
  { month: "Mar", applications: 150, events: 12 },
  { month: "Apr", applications: 200, events: 18 },
];

const mentorRatio = [
  { group: "Pre-incubation", ratio: 25 },
  { group: "Startup", ratio: 40 },
  { group: "Acceleration", ratio: 15 },
];

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

const Analytics = () => {
  return (
    <div className="p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Track progress, applications, mentorship, and system activity.
        </p>
      </div>

      {/* General Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>General Overview</CardTitle>
            <p className="text-sm text-gray-500">
              Summary of all user roles and system activity
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
                    {userDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4">
                {userDistribution.map((user, idx) => {
                  const total = userDistribution.reduce(
                    (sum, u) => sum + u.value,
                    0
                  );
                  const percent = ((user.value / total) * 100).toFixed(1);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-xl text-center shadow-sm"
                    >
                      <p className="text-xl font-bold text-gray-800">
                        {user.value}
                      </p>
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

      {/* Students Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Students Analytics</CardTitle>
            <p className="text-sm text-gray-500">
              Applications and event participation per month
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3b82f6" />
                <Bar dataKey="events" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mentors Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mentor-Student Ratios</CardTitle>
            <p className="text-sm text-gray-500">
              Students per mentor across incubation stages
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Insights & Suggestions</CardTitle>
            <p className="text-sm text-gray-500">
              Recommendations based on current data trends
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>📈 <strong>Engagement:</strong> Students activity has increased by 18% in the last quarter.</li>
              <li>⚠️ <strong>Mentor Capacity:</strong> Applications exceeded <span className="font-semibold">300 this month</span>. Consider recruiting more mentors.</li>
              <li>💡 <strong>Incubation Progress:</strong> 60% of students remain in <em>Pre-incubation</em>. More support workshops may be required to move them forward.</li>
              <li>📊 <strong>Events:</strong> Event attendance averages 75%. Sending targeted reminders could raise this to above 85%.</li>
              <li>✅ <strong>System Health:</strong> Notifications and emails are reaching 95% of recipients successfully.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
