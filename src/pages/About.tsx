import { FaCheckCircle, FaLightbulb, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <main className="wrapper space-y-12">
      {/* ===== Intro Section ===== */}
      <section className="text-center">
        <h1 className="subHeading">About LearnHub</h1>
        <p className="text-text-light text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          LearnHub is a student-driven platform empowering learners through
          technology, collaboration, and practical challenges. We believe in
          learning by doing.
        </p>
      </section>

      {/* ===== Our Mission ===== */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <img
            src="/about-mission.jpg"
            alt="Mission illustration"
            className="rounded-xl w-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-dark mb-4 flex items-center gap-2">
            <FaLightbulb className="text-green-100" />
            Our Mission
          </h2>
          <p className="text-text text-base leading-relaxed">
            We aim to bridge the gap between theoretical learning and practical
            application. Our programs encourage creativity, team spirit, and
            real-world thinking in students.
          </p>
        </div>
      </section>

      {/* ===== Core Values ===== */}
      <section>
        <h2 className="subHeading">Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Collaboration",
              desc: "Working together to solve real-world problems through tech and teamwork.",
              icon: <FaUsers className="text-green-100 text-3xl" />,
            },
            {
              title: "Innovation",
              desc: "We support experimentation, creativity, and learning by doing.",
              icon: <FaLightbulb className="text-green-100 text-3xl" />,
            },
            {
              title: "Excellence",
              desc: "We strive to deliver quality learning experiences for every student.",
              icon: <FaCheckCircle className="text-green-100 text-3xl" />,
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="mb-3">{value.icon}</div>
              <h3 className="text-xl font-semibold text-dark mb-2">{value.title}</h3>
              <p className="text-text-light text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
