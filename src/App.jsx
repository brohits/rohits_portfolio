import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BlogsPage } from "./pages/BlogsPage";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { HomePage } from "./pages/HomePage";
import { WorkPage } from "./pages/WorkPage";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogPostPage />} />
        <Route path="/rohit@9589" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
