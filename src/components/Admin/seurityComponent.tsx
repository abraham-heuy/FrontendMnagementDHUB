import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SecuritySection: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password validation rules
  const passwordRules = {
    length: passwords.new.length >= 12,
    uppercase: /[A-Z]/.test(passwords.new),
    lowercase: /[a-z]/.test(passwords.new),
    number: /\d/.test(passwords.new),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new),
  };

  // Strength calculation
  const strengthScore = Object.values(passwordRules).filter(Boolean).length;
  const strength =
    strengthScore <= 2
      ? "Weak"
      : strengthScore <= 4
      ? "Medium"
      : "Strong";

  const strengthColor =
    strength === "Weak"
      ? "text-red-500"
      : strength === "Medium"
      ? "text-yellow-500"
      : "text-green-600";

  const handleChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const toggleShow = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={show.current ? "text" : "password"}
            value={passwords.current}
            onChange={(e) => handleChange("current", e.target.value)}
            className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400 pr-10"
          />
          <button
            type="button"
            onClick={() => toggleShow("current")}
            className="absolute right-2 top-2 text-slate-500"
          >
            {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={show.new ? "text" : "password"}
            value={passwords.new}
            onChange={(e) => handleChange("new", e.target.value)}
            className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400 pr-10"
          />
          <button
            type="button"
            onClick={() => toggleShow("new")}
            className="absolute right-2 top-2 text-slate-500"
          >
            {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Strength indicator */}
        {passwords.new && (
          <p className={`text-xs mt-1 font-medium ${strengthColor}`}>
            Strength: {strength}
          </p>
        )}

        {/* Rules */}
        <ul className="text-xs mt-2 space-y-1 text-slate-600">
          <li className={passwordRules.length ? "text-green-600" : ""}>
            • At least 12 characters
          </li>
          <li className={passwordRules.uppercase ? "text-green-600" : ""}>
            • At least one uppercase letter
          </li>
          <li className={passwordRules.lowercase ? "text-green-600" : ""}>
            • At least one lowercase letter
          </li>
          <li className={passwordRules.number ? "text-green-600" : ""}>
            • At least one number
          </li>
          <li className={passwordRules.special ? "text-green-600" : ""}>
            • At least one special character
          </li>
        </ul>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) => handleChange("confirm", e.target.value)}
            className="w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-400 pr-10"
          />
          <button
            type="button"
            onClick={() => toggleShow("confirm")}
            className="absolute right-2 top-2 text-slate-500"
          >
            {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwords.confirm && passwords.new !== passwords.confirm && (
          <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
        )}
      </div>
    </div>
  );
};

export default SecuritySection;
