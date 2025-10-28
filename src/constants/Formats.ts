interface TimeFormatOptions {
  hour: "numeric";
  minute: "2-digit";
  hour12: boolean;
}

const formatTime = (timeString: string): string => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const date: Date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));

  const options: TimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleTimeString([], options);
};


export { formatTime };