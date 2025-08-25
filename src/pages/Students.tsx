import { useState } from "react";
import Sidebar, { type DashboardTab } from "../components/students/Sidebar";
import Topbar from "../components/students/Topbar";
import StartupStageTracker from "../components/students/StartupStageTracker";
import { events, mentors, notes, resources } from "../data/data";
import EventsList from "../components/students/EventsList";
import MentorsCard from "../components/students/MentorsCard";
import ResourcesGrid from "../components/students/ResourcesGrid";
import NotificationsPanel from "../components/students/NotificationsPanel";
import { FiLogOut, FiMenu } from "react-icons/fi";
import proImage from '../assets/images/success.png'


const STAGES = [
  { name: "Pre-Incubation", subStages: ["Ideation", "Concept & Problem", "Market Research", "Prototype", "Monthly Report"] },
  { name: "Incubation", subStages: ["BMC", "Business Plan", "Proof of Concept", "Team", "Pitch", "Monthly Report"] },
  { name: "Startup", subStages: ["Pitch", "Funding", "Product/Service", "Market Report"] },
];

const Students = () => {
  const [active, setActive] = useState<DashboardTab>("startup");
  const [open, setOpen] = useState(false); // sidebar state
  const [startup, setStartup] = useState({
    title: "AgroSense Analytics",
    stageIndex: 0,
    subStageIndex: 0,
  });

  // accont deatils
  const name = "alex"
  const image = proImage


  // stage navigation
  const next = () => {
    const s = STAGES[startup.stageIndex];
    if (startup.subStageIndex < s.subStages.length - 1) {
      setStartup({ ...startup, subStageIndex: startup.subStageIndex + 1 });
    } else if (startup.stageIndex < STAGES.length - 1) {
      setStartup({ ...startup, stageIndex: startup.stageIndex + 1, subStageIndex: 0 });
    }
  };
  const prev = () => {
    if (startup.subStageIndex > 0) {
      setStartup({ ...startup, subStageIndex: startup.subStageIndex - 1 });
    } else if (startup.stageIndex > 0) {
      const prevStageIdx = startup.stageIndex - 1;
      const lastSub = STAGES[prevStageIdx].subStages.length - 1;
      setStartup({ ...startup, stageIndex: prevStageIdx, subStageIndex: lastSub });
    }
  };

  return (
    <div className="bg-secondary min-h-screen flex">

      <Sidebar active={active} onChange={setActive} open={open} setOpen={setOpen} />

      {/* Main */}
      <div className="flex-1 p-4 md:p-8 space-y-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center bg-white shadow px-4 py-3 rounded-lg gap-2">
          <div className="flex md:flex justify-center items-center gap-1 sm:gap2 shadow-md px-3 py-1 rounded-md">
            <h1 className="font-normal text-sm  md:text-base font-serif">Welcome back <span className="font-semibold  italic md:text-lg px-1 ">{name}</span></h1>
            <img
              className="w-12 h-12  rounded-full"
              src={image} alt="image"
            />
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <button
              className="text-green-600 flex  gap-2  justify-center items-center shadow-md px-2 rounded-md mb-2 py-1.5 cursor-pointer"
            >
              <FiLogOut size={18} />
              <span className="text-xs">LogOut</span>
            </button>

            <button onClick={() => setOpen(true)} className="text-green-600 shadow w-full flex justify-center items-center py-2 px-1 rounded-md cursor-pointer  mb-2">
              <FiMenu size={18} />
            </button>

          </div>
        </div>


        <div className=" w-full rounded-2xl bg-white">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-between px-6  py-3 shadow-2xl">
            <h2 className="font-serif text-base">Welcome back <span className="text-green-100 text-2xl px-2 font-bold">{name}</span></h2>
            <div className=" text-green-100 shadow-md px-2 py-2 rounded-md  cursor-pointer  hover:bg-gray-200/60 flex  gap-3 justify-center items-center space-y-1 ">
              <FiLogOut size={20} className="" />
              <p className="text-lg"> logout</p>
            </div>
          </div>

          <Topbar
            title={
              active === "startup"
                ? "Startup Information"
                : active === "progress"
                  ? "Progress"
                  : active === "events"
                    ? "Events & Workshops"
                    : active === "mentors"
                      ? "Mentorship"
                      : active === "resources"
                        ? "Resources"
                        : "Notifications"
            }
            badge={STAGES[startup.stageIndex].name}
          />
        </div>




        {active === "startup" && (
          <StartupStageTracker
            title={startup.title}
            stageIndex={startup.stageIndex}
            subStageIndex={startup.subStageIndex}
            stages={STAGES}
            onTitleChange={(v) => setStartup({ ...startup, title: v })}
            onPrev={prev}
            onNext={next}
          />
        )}

        {active === "progress" && (
          <section className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              (Coming soon) Visualize all milestones across stages with a timeline and submissions.
            </p>
          </section>
        )}

        {active === "events" && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <EventsList events={events} />
          </div>
        )}

        {active === "mentors" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MentorsCard mentors={mentors} />
          </div>
        )}

        {active === "resources" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ResourcesGrid resources={resources} />
          </div>
        )}

        {active === "notifications" && <NotificationsPanel items={notes} />}
      </div>
    </div>
  );
};

export default Students;
