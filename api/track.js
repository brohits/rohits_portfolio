import { handleTrack } from "../lib/analytics-handlers.js";

export default function handler(request) {
  return handleTrack(request);
}

export const config = {
  runtime: "nodejs",
};
