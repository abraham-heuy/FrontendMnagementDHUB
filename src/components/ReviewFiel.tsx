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
    <div className="space-y-0.5">
      <p className="text-[10px] md:text-xs font-semibold text-gray-600">{label}</p>
      {textarea ? (
        <p className="p-2 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-line min-h-[60px] text-gray-800 text-[10px] md:text-xs leading-relaxed">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      ) : (
        <p className="px-2 py-1.5 bg-gray-50 rounded-md text-gray-800 text-[10px] md:text-xs">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
      )}
    </div>
  );
};

export default ReviewField;