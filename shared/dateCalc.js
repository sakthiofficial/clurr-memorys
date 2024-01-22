export function dateToUnixTimestamp(dateString) {
  const dateObject = new Date(dateString);

  const unixTimestamp = dateObject.getTime();

  return Math.floor(unixTimestamp / 1000);
}
