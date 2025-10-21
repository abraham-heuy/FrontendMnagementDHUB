import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewField from "../components/ReviewFiel";
import { businessSections } from "../data/data";
import Navigation from "../components/Navigation";
import Modal from "../components/Modal";
import modalImage from "../assets/images/Logo.png";
import { applyToEvent } from "../lib/services/applicationService";
import InputField from "../components/InputField";
import { FaUserFriends, FaTrash, FaPlus, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const Application = () => {
  const { eventId } = useParams(); // ✅ Get eventId from the URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    regNo: "",
    name: "",
    email: "",
    phone: "",
    businessIdea: "",
    problemStatement: "",
    solution: "",
    targetMarket: "",
    revenueModel: "",
  });

  const [teamMembers, setTeamMembers] = useState<string[]>([""]);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Personal", "Team", "Pitch", "Review"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    if (validationError) setValidationError(""); // Clear error on input
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, value: string) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    setValidationError("");

    switch (step) {
      case 0: // Personal Details
        if (!form.name.trim()) {
          setValidationError("Full name is required");
          return false;
        }
        if (!form.email.trim()) {
          setValidationError("Email is required");
          return false;
        }
        if (!form.regNo.trim()) {
          setValidationError("Registration number is required");
          return false;
        }
        if (!form.phone.trim()) {
          setValidationError("Phone number is required");
          return false;
        }
        return true;

      case 1: // Team Members (optional, always valid)
        return true;

      case 2: // Business Pitch
        if (!form.businessIdea.trim()) {
          setValidationError("Business idea is required");
          return false;
        }
        if (!form.problemStatement.trim()) {
          setValidationError("Problem statement is required");
          return false;
        }
        if (!form.solution.trim()) {
          setValidationError("Solution is required");
          return false;
        }
        if (!form.targetMarket.trim()) {
          setValidationError("Target market is required");
          return false;
        }
        if (!form.revenueModel.trim()) {
          setValidationError("Revenue model is required");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleSubmit = async () => {
    if (!eventId) {
      alert("Invalid or missing event ID. Please go back and try again.");
      navigate("/");
      return;
    }

    // Filter out empty team members
    const filteredTeamMembers = teamMembers.filter(member => member.trim() !== "");

    try {
      const submissionData = {
        ...form,
        teamMembers: filteredTeamMembers.join(", "), // Send as comma-separated string
      };

      const response = await applyToEvent(eventId, submissionData);
      console.log("✅ Application submitted:", response);
      setShowConfirmDialog(false);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("❌ Error submitting application:", error);
      alert(error.message || "Error submitting application");
      setShowConfirmDialog(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-green-50 p-2 md:p-4">
      <Navigation />

      <div className="bg-white mx-2 my-16 md:my-20 shadow-lg rounded-xl p-4 md:p-6 w-full max-w-4xl">
        {/* ===== Compact Header ===== */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg mb-2">
            <FaCheckCircle className="text-xl text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Startup Incubation Program
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            Apply for our entrepreneurship program
          </p>

          {/* Compact Progress Bar */}
          <div className="relative w-full mt-6 mb-4">
            <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 rounded-full" />
            <div
              className="absolute left-0 top-4 h-1 bg-green-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${currentStep >= index
                      ? "bg-green-600 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] md:text-xs font-medium ${currentStep === index ? "text-green-700" : "text-gray-400"
                      }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="text-sm" />
              {validationError}
            </p>
          </div>
        )}

        {/* ===== Step 1: Personal Details ===== */}
        {currentStep === 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <h2 className="text-sm md:text-base font-semibold text-gray-800">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="Full Name"
                value={form.name}
                type="text"
                placeholder="John Doe"
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <InputField
                label="Email"
                type="email"
                placeholder="name@students.dkut.ac.ke"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              <InputField
                label="Registration Number"
                value={form.regNo}
                placeholder="ABC123"
                onChange={(e) => handleChange("regNo", e.target.value)}
                required
              />
              <InputField
                label="Phone Number"
                value={form.phone}
                type="tel"
                placeholder="0700123456"
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* ===== Step 2: Team Members ===== */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-emerald-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
                <FaUserFriends />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-800">Team Members</h2>
                <p className="text-[10px] md:text-xs text-gray-600">Optional - add if applicable</p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-2 border-blue-400 p-2 rounded-r-lg mb-3">
              <p className="text-[10px] md:text-xs text-blue-700">
                💡 Add team members or leave blank for solo application
              </p>
            </div>

            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <InputField
                      label={`Member ${index + 1}`}
                      value={member}
                      type="text"
                      placeholder="Enter name"
                      onChange={(e) => updateTeamMember(index, e.target.value)}
                    />
                  </div>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="mt-6 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors text-sm"
                      title="Remove"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTeamMember}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs font-medium"
            >
              <FaPlus className="text-[10px]" /> Add Member
            </button>
          </div>
        )}

        {/* ===== Step 3: Business Pitch ===== */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-emerald-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-800">Business Pitch</h2>
                <p className="text-[10px] md:text-xs text-gray-600">Describe your business idea</p>
              </div>
            </div>

            <div className="space-y-3">
              {businessSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xs md:text-sm text-gray-800 mb-1">{section.title}</h3>
                      <p className="text-[10px] md:text-xs text-gray-600 mb-2">{section.description}</p>
                      <div className="bg-amber-50 p-2 rounded-md border border-amber-200">
                        <p className="text-[9px] md:text-[10px] text-amber-700 flex items-start">
                          <span className="mr-1">💡</span>
                          <span>{section.guidance}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <InputField
                    textarea
                    value={form[section.key as keyof typeof form]}
                    onChange={(e) => handleChange(section.key, e.target.value)}
                    placeholder={section.placeholder}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== Step 4: Review ===== */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                <FaCheckCircle />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-800">Review Application</h2>
                <p className="text-[10px] md:text-xs text-gray-600">Verify details before submitting</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded-r-lg mb-3">
              <p className="text-[10px] md:text-xs text-yellow-700 flex items-center gap-1">
                <FaExclamationTriangle className="text-xs" /> Ensure all information is accurate
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
              <h3 className="font-semibold text-xs md:text-sm text-green-700 mb-2 pb-1 border-b border-green-100">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ReviewField label="Full Name" value={form.name} />
                <ReviewField label="Email" value={form.email} />
                <ReviewField label="Registration No" value={form.regNo} />
                <ReviewField label="Phone" value={form.phone} />
              </div>
            </div>

            {teamMembers.filter(m => m.trim() !== "").length > 0 && (
              <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-100">
                <h3 className="font-semibold text-xs md:text-sm text-emerald-700 mb-2 pb-1 border-b border-emerald-100 flex items-center gap-1">
                  <FaUserFriends className="text-xs" />
                  Team Members
                </h3>
                <div className="space-y-1.5">
                  {teamMembers.filter(m => m.trim() !== "").map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-md">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-xs text-gray-700">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <h3 className="font-semibold text-xs md:text-sm text-blue-700 mb-2 pb-1 border-b border-blue-100">
                Business Pitch
              </h3>
              <div className="space-y-2">
                {businessSections.map((section, index) => (
                  <ReviewField
                    key={index}
                    label={section.title}
                    value={form[section.key as keyof typeof form]}
                    textarea
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== Navigation Buttons ===== */}
        <div className="fixed px-2 md:px-6 bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-4xl z-50">
          <div className="flex justify-between items-center bg-white/95 backdrop-blur-sm px-3 md:px-4 py-2.5 rounded-lg shadow-lg border border-gray-200">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition-colors shadow-md"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-1.5"
              >
                <FaCheckCircle className="text-xs" /> Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5">
            <div className="text-center mb-4">
              <div className="inline-block p-3 bg-yellow-100 rounded-full mb-3">
                <FaExclamationTriangle className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">Confirm Submission</h3>
              <p className="text-xs text-gray-600">
                Review all details carefully before submitting.
              </p>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-lg mb-4">
              <p className="text-[10px] md:text-xs text-gray-700">
                <strong>Note:</strong> You won't be able to edit after submission.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FaCheckCircle className="text-xs" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success 🎉"
        image={modalImage}
        message="Application submitted successfully! We'll review it and contact you soon."
      />
    </div>
  );
};

export default Application;
