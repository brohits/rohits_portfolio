import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initClickTracking, trackPageView } from "../lib/analytics-client";

export function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    initClickTracking();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
