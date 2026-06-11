import { handleAnalytics } from "../lib/analytics-handlers.js";

export const config = {
  runtime: "edge",
};

export default function handler(request) {
  return handleAnalytics(request);
}
