import { convertTimestampToDateTime } from "@/appConstants";
import { activityDataFields } from "./entity";

export function structureDataInDateWise(data) {
  if (!data) {
    return null;
  }
  const dateWise = {} || null;
  for (let i = 0; i < data?.length; i += 1) {
    const date = convertTimestampToDateTime(
      data[i][activityDataFields?.created],
    ).split(" ");
    const key = date[0];

    if (dateWise[key]) {
      dateWise[key].push(data[i]);
    } else {
      dateWise[key] = [data[i]];
    }
  }
  return [dateWise];
}
