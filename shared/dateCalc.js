export function dateToUnixTimestamp(dateString) {
  const dateObject = new Date(dateString);

  const unixTimestamp = dateObject.getTime();

  return Math.floor(unixTimestamp / 1000).toString();
}
export function unixToDate(unixTimestamp) {
  // Convert Unix timestamp to milliseconds
  const unixMilliseconds = unixTimestamp * 1000;

  // Create a new Date object
  const dateObject = new Date(unixMilliseconds);

  // Extract individual components of the date and time
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  // Format the result as "YYYY-MM-DD HH:mm:ss"
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}
