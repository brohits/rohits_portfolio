import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyticsApiPlugin } from "./server/vite-analytics-plugin.js";

export default defineConfig({
  plugins: [react(), analyticsApiPlugin()],
});
