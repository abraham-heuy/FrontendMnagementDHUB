const ReviewField = ({ 
  label, 
  value, 
  textarea = false 
}: { 
  label: string; 
  value: string; 
  textarea?: boolean 
}) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      {textarea ? (
        <p className="p-3 bg-white border border-gray-200 rounded-lg  whitespace-pre-line min-h-[80px] text-dark text-sm leading-relaxed shadow-sm">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      ) : (
        <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-800 text-sm shadow-sm">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      )}
    </div>
  );
};

export default ReviewField;
