import { useEffect, useState } from "react";
import ListStartups from "./ListStartups"
import type { Startup } from "../../../lib/types/startup";
import { startupService } from "../../../lib/services/startupService";


const StartupTrack = () => {


  // states
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStartups();
  }, []);

  // load startups from API
  const loadStartups = async () => {
    try {
      setLoading(true);
      const startupsData: Startup[] = await startupService.getMyStartup();

      setStartups(Array.isArray(startupsData) ? startupsData : []);

    } catch (err: any) {
      setError(err.message || "Failed to load startups");
    } finally {
      setLoading(false);
    }
  };

  // viewd datails of a startup
  const viewStartupDetails = (startup: Startup) => {
    setSelectedStartup(startup);
    setShowDetailModal(true);
  };
  
  return (
    <div className="space-y-3 px-3 md:px-6 py-3 bg-black/20 rounded-2xl backdrop-blur-md h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      <div className="bg-secondary rounded-xl shadow-sm overflow-hidden flex-1 min-h-0">
        <ListStartups
          startups={startups}
          onViewDetails={viewStartupDetails}
        />
      </div>

    </div>
  )
}

export default StartupTrack