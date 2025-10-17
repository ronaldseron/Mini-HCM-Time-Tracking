export const formatTime = (time) => {
  if (!time) return "";
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
 
  const match = time.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    let [, hours, minutes, seconds, period] = match;
    hours = parseInt(hours);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`;
  }
  return time;
};