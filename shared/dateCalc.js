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

  // Extract individual components of the date and time
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(dateObject.getDate()).padStart(2, "0");
  let hours = dateObject.getHours();
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the result as "YYYY-MM-DD hh:mm:ss AM/PM"
  const formattedDateTime = `${hours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
}
