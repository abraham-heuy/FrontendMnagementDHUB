import { FiUsers } from "react-icons/fi";
import type { Startup } from "../../../lib/types/startup";


// props for ListStartups component
interface ListStartupsProps {
  startups: Startup[];
  onViewDetails: (startup: Startup) => void;
}


const ListStartups: React.FC<ListStartupsProps> = ({
  startups,
  onViewDetails,
}) => {
  // If the current student has no startups
  if (!startups || startups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm min-h-[400px]">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <FiUsers className="text-green-600 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No startups found</h3>
        <p className="text-gray-500 text-center max-w-md">
          You are not currently associated with any startups. Please contact your administrator for more information.
        </p>
      </div>
    );
  }

  // Get the first letter of startup name for the avatar
  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };


  return (
    <div className="bg-secondary/60 rounded-xl overflow-hidden flex-1 min-h-0">
      {/* Header -> show the deatils of the start for the user*/}
      <div className="px-6 py-4 text-green-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">My Startups</h2>
          <div className="text-sm bg-green-200 bg-opacity-20 px-3 py-1 rounded-md text-white">
            {startups.length} startup{startups.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      {/* Startup List */}
      <div className="p-6 overflow-auto max-h-[calc(100vh-180px)] [scrollbar-width:none] [-ms-overflow-style:none]">
        <ul className="space-y-4">
          {startups.map((startup) => (
            <li
              key={startup.startup_id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails(startup)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar with first letter of startup name */}
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-semibold">
                  {getAvatarLetter(startup.title)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{startup.title}</h3>
                  <p className="text-sm text-gray-500">Stage: {startup.stage?.name}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400 group-hover:text-green-600 transition-colors">
                View Details &rarr;
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ListStartups