import { handleAnalytics } from "../lib/analytics-handlers.js";

export default function handler(request) {
  return handleAnalytics(request);
}

export const config = {
  runtime: "nodejs",
};
