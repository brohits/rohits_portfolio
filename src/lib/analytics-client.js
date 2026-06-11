const VISITOR_KEY = "portfolio-visitor-id";
const SESSION_KEY = "portfolio-session-id";
const DASHBOARD_PATH = "/rohit@9589";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = createId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = createId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function shouldTrackPath(pathname) {
  return pathname !== DASHBOARD_PATH;
}

function getClickLabel(target) {
  const link = target.closest("a");
  if (link) {
    return (link.textContent || link.getAttribute("aria-label") || "Link").trim();
  }

  const button = target.closest("button");
  if (button) {
    return (button.textContent || button.getAttribute("aria-label") || "Button").trim();
  }

  const card = target.closest(".project-card, .blog-card-hitarea");
  if (card) {
    const title = card.querySelector(".card-title, .blog-card-title");
    return title?.textContent?.trim() || "Card click";
  }

  return "";
}

export async function trackEvent(type, details = {}) {
  if (!shouldTrackPath(window.location.pathname)) {
    return;
  }

  const payload = {
    type,
    path: window.location.pathname + window.location.hash,
    referrer: document.referrer || "",
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    timestamp: new Date().toISOString(),
    ...details,
  };

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    /* analytics should never break the site */
  }
}

export function trackPageView(pathname) {
  if (!shouldTrackPath(pathname)) return;
  trackEvent("pageview", { path: pathname });
}

export function initClickTracking() {
  document.addEventListener(
    "click",
    (event) => {
      if (!shouldTrackPath(window.location.pathname)) return;

      const target = event.target;
      const link = target.closest("a");
      const interactive = target.closest(
        "a, button, .project-card, .blog-card-hitarea, .work-more-btn"
      );

      if (!interactive) return;

      const label = getClickLabel(target);
      const href = link?.href || "";

      trackEvent("click", {
        label: label.slice(0, 120),
        href,
        path: window.location.pathname + window.location.hash,
      });
    },
    { capture: true }
  );
}
