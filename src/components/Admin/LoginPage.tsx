import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminLoginProps {
  onLogin?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";

    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // mock API

      if (email === "admin@example.com" && password === "admin123") {
        if (onLogin) onLogin();
        navigate("/admin");
      } else {
        setGeneralError("Invalid email or password.");
      }
    } catch {
      setGeneralError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        {generalError && <div style={styles.generalError}>{generalError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Field */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#e53935" : "#ccc",
              }}
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: errors.password ? "#e53935" : "#ccc",
                  paddingRight: 40,
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && <div style={styles.error}>{errors.password}</div>}
          </div>

          {/* Forgot Password */}
          <div style={styles.forgotPassword}>
            <a href="#" style={styles.forgotLink}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 40,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    backgroundColor: "#ffffff",
    width: 380,
    maxWidth: "90%",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  title: {
    marginBottom: 24,
    color: "#2E7D32",
    fontSize: 24,
    fontWeight: 600,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  togglePassword: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#2E7D32",
    fontWeight: 500,
    userSelect: "none",
  },
  error: {
    marginTop: 4,
    color: "#e53935",
    fontSize: 13,
  },
  generalError: {
    marginBottom: 12,
    color: "#e53935",
    fontSize: 14,
    fontWeight: 500,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotLink: {
    color: "#2E7D32",
    fontSize: 14,
    textDecoration: "none",
  },
  button: {
    padding: 12,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#FFD700",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16,
    transition: "background 0.3s",
  },
};

export default AdminLogin;
