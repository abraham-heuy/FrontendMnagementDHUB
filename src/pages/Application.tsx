import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/InputField";
import ReviewField from "../components/ReviewFiel";
import { businessSections } from "../data/data";
import Navigation from "../components/Navigation";
import Modal from "../components/Modal";
import modalImage from "../assets/images/Logo.png";
import { applyToEvent } from "../lib/services/applicationService";

const Application = () => {
  const { eventId } = useParams(); // ✅ Get eventId from the URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    regNo: "",
    name: "",
    email: "",
    phone: "",
    teamMembers: "",
    businessIdea: "",
    problemStatement: "",
    solution: "",
    targetMarket: "",
    revenueModel: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Personal Details", "Business Pitch", "Review & Submit"];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) {
      alert("Invalid or missing event ID. Please go back and try again.");
      navigate("/");
      return;
    }

    try {
      const response = await applyToEvent(eventId, form);
      console.log("✅ Application submitted:", response);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("❌ Error submitting application:", error);
      alert(error.message || "Error submitting application");
    }
  };

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen flex justify-center items-center bg-secondary md:p-8">
      <Navigation />

      <form
        onSubmit={handleSubmit}
        className="bg-white mx-6 mb-24 mt-20 shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-6xl space-y-8"
      >
        {/* ===== Header ===== */}
        <div className="text-center">
          <h1 className="text-2xl text-start md:text-center md:text-4xl font-bold bg-green-200 bg-clip-text text-transparent mb-3">
            Startup Incubation Program
            <hr className="bg-green-200 my-2" />
          </h1>
          <p className="text-gray-600 mb-6 text-sm text-start md:text-lg md:text-center">
            Apply for our entrepreneurship program and bring your idea to life
          </p>

          {/* Progress Bar */}
          <div className="relative w-full">
            <div className="absolute left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
            <div
              className="absolute left-0 h-1 bg-green-200 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between mt-12 w-full">
              {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex-col items-center">
                  <div
                    className={`h-8 w-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 ${
                      currentStep >= index ? "bg-green-200" : "bg-gray-400 text-dark"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm italic font-medium ${
                      currentStep === index ? "text-green-900" : "text-gray-300"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Step 1: Personal Details ===== */}
        {currentStep === 0 && (
          <div className="space-y-6 mt-28">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-white font-bold mr-3">
                1
              </div>
              <h2 className="text-xl font-bold text-dark font-serif italic">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
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
                label="Reg No"
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

        {/* ===== Step 2: Business Pitch ===== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold mr-3">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Business Pitch
                <hr className="bg-green-200" />
              </h2>
            </div>

            <p className="text-dark font-serif italic mb-6">
              Describe your business idea in detail. We've included guidance to help you with each
              section.
            </p>

            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
              {businessSections.map((section, index) => (
                <div
                  key={index}
                  className="space-y-2 bg-secondary/10 px-3 py-2 rounded-2xl shadow-2xl border-2 border-gray-500/20"
                >
                  <h3 className="font-semibold text-dark font-serif text-lg">{section.title}</h3>
                  <p className="text-sm text-dark font-serif italic mb-3">{section.description}</p>
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-xs font-serif italic text-amber-700 flex items-start">
                      <span className="mr-2">💡</span>
                      {section.guidance}
                    </p>
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

        {/* ===== Step 3: Review ===== */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-white font-bold mr-3">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-serif">Review Your Application</h2>
            </div>

            <p className="text-gray-600 font-serif italic mb-4">
              Please double-check your details before submitting.
            </p>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-lg text-emerald-600 mb-4 border-b pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReviewField label="Full Name" value={form.name} />
                <ReviewField label="Email" value={form.email} />
                <ReviewField label="Reg No" value={form.regNo} />
                <ReviewField label="Phone" value={form.phone} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="font-semibold text-lg text-green-100 mb-4 border-b pb-2">Business Pitch</h3>
              <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="fixed px-6 bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
          <div className="flex justify-between items-center bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-gray-200">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-3 py-2 border border-gray-300 cursor-pointer rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-green-100 text-white rounded-md cursor-pointer font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-100 text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-lg cursor-pointer shadow-emerald-100"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success 🎉"
        image={modalImage}
        message="Your details have been submitted successfully!"
      />
    </div>
  );
};

export default Application;
