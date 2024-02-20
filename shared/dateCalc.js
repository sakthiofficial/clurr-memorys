export function dateToUnixTimestamp(dateString) {
  const dateObject = new Date(dateString);

  const unixTimestamp = dateObject.getTime();

  return Math.floor(unixTimestamp / 1000).toString();
}
export function unixTo12HourTime(unixTimestamp) {
  // Convert Unix timestamp to milliseconds
  const unixMilliseconds = unixTimestamp * 1000;

  // Create a new Date object
  const dateObject = new Date(unixMilliseconds);

  let hours = dateObject.getHours();
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  // Determine AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the result as "YYYY-MM-DD hh:mm:ss AM/PM"
  const formattedDateTime = `${hours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
}

export function unixToDate(unixTimestamp) {
  // Convert Unix timestamp to milliseconds
  const timestampInMillis = unixTimestamp * 1000;

  // Create a new Date object
  const date = new Date(timestampInMillis);

  // Get day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Concatenate day, month, and year
  const formattedDate = `${day} ${month} ${year}`;

  return formattedDate;
}

export default function isTodayOrYesterday(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(date);

  if (inputDate.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (inputDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return false;
}
