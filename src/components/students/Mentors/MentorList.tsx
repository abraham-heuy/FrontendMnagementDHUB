import { FiMail, FiUser, FiPhone } from "react-icons/fi";

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const MentorList = () => {
  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Dr. James Kamau",
      email: "james.kamau@example.com",
      phone: "+254 712 345 678"
    },
    {
      id: "2", 
      name: "Prof. Mary Wanjiku",
      email: "mary.wanjiku@example.com",
      phone: "+254 723 456 789"
    },
    {
      id: "3",
      name: "Eng. Robert Adebayo",
      email: "robert.adebayo@example.com",
      phone: "+254 734 567 890"
    }
  ];

  return (
    <div className="bg-white/40 h-full rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-50 p-2 rounded-lg">
          <FiUser className="text-green-200 text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Your Mentors</h2>
          <p className="text-gray-500 text-sm">
            {mentors.length} mentor{mentors.length !== 1 ? 's' : ''} available for support
          </p>
        </div>
      </div>

      {/* Mentors List */}
      {mentors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiUser className="mx-auto text-3xl text-gray-300 mb-2" />
          <p>No mentors assigned yet</p>
          <p className="text-sm mt-1">Your mentors will appear here once allocated</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors">
              {/* Mentor Name */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-200">{mentor.name}</h3>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center text-text text-sm">
                  <FiMail className="mr-2 text-green-100" size={14} />
                  <span className="truncate text-light italic">{mentor.email}</span>
                </div>
                
                {mentor.phone && (
                  <div className="flex  items-center text-light text-sm">
                    <FiPhone className="mr-2 text-green-100" size={14} />
                    <span className="text-xs italic">{mentor.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorList;