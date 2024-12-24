import { components } from "../schema";

export function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

export const getReadablePositionFromScan = (
  scan: components["schemas"]["Scan"]
) => {
  if (!scan.position) {
    return "Unknown location";
  }
  if (scan.readable_location) {
    return scan.readable_location;
  }
  return `${scan.position.latitude}, ${scan.position.longitude}`;
};
