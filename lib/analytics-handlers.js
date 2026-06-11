import { appendEvent, clearEvents, getStorageMode, loadEvents } from "./analytics-store.js";

const PASSWORD = process.env.ANALYTICS_PASSWORD || "9589";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Analytics-Key",
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

function isAuthorized(request) {
  const headerKey = request.headers.get("x-analytics-key");
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("key");
  const candidate = headerKey || bearer || queryKey;
  return candidate === PASSWORD;
}

function parseDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad/.test(ua)) return "mobile";
  if (/tablet/.test(ua)) return "tablet";
  return "desktop";
}

function parseBrowser(userAgent = "") {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/firefox/i.test(userAgent)) return "Firefox";
  return "Other";
}

function getGeo(request) {
  return {
    country: request.headers.get("x-vercel-ip-country") || "Unknown",
    region: request.headers.get("x-vercel-ip-country-region") || "",
    city: request.headers.get("x-vercel-ip-city") || "",
  };
}

function summarize(events) {
  const pageViews = events.filter((event) => event.type === "pageview");
  const clicks = events.filter((event) => event.type === "click");
  const sessions = new Set(events.map((event) => event.sessionId).filter(Boolean));
  const visitors = new Set(events.map((event) => event.visitorId).filter(Boolean));

  const byPath = {};
  const byReferrer = {};
  const byCountry = {};
  const byLabel = {};
  const byDay = {};

  for (const event of pageViews) {
    byPath[event.path] = (byPath[event.path] || 0) + 1;
    const ref = event.referrer || "Direct / none";
    byReferrer[ref] = (byReferrer[ref] || 0) + 1;
    const country = event.country || "Unknown";
    byCountry[country] = (byCountry[country] || 0) + 1;
    const day = event.timestamp.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }

  for (const event of clicks) {
    const label = event.label || event.href || "Unknown click";
    byLabel[label] = (byLabel[label] || 0) + 1;
  }

  const toSorted = (record) =>
    Object.entries(record)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

  return {
    totals: {
      events: events.length,
      pageViews: pageViews.length,
      clicks: clicks.length,
      sessions: sessions.size,
      visitors: visitors.size,
    },
    topPages: toSorted(byPath).slice(0, 12),
    topReferrers: toSorted(byReferrer).slice(0, 12),
    topCountries: toSorted(byCountry).slice(0, 12),
    topClicks: toSorted(byLabel).slice(0, 15),
    visitsByDay: toSorted(byDay).slice(-14),
    recent: [...events].reverse().slice(0, 50),
  };
}

export async function handleTrack(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const geo = getGeo(request);
  const userAgent = payload.userAgent || request.headers.get("user-agent") || "";

  const event = {
    id: crypto.randomUUID(),
    type: payload.type || "pageview",
    path: payload.path || "/",
    label: payload.label || "",
    href: payload.href || "",
    referrer: payload.referrer || "",
    sessionId: payload.sessionId || "",
    visitorId: payload.visitorId || "",
    country: geo.country,
    region: geo.region,
    city: geo.city,
    device: parseDevice(userAgent),
    browser: parseBrowser(userAgent),
    screen: payload.screen || "",
    language: payload.language || "",
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  try {
    await appendEvent(event);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("track error", error);
    return jsonResponse({ error: "Failed to save event" }, 500);
  }
}

export async function handleAnalytics(request) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (!isAuthorized(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    if (request.method === "GET") {
      const events = await loadEvents();
      return jsonResponse({
        storage: getStorageMode(),
        summary: summarize(events),
        events,
      });
    }

    if (request.method === "DELETE") {
      await clearEvents();
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("analytics error", error);
    return jsonResponse(
      { error: error?.message || "Analytics API failed" },
      500
    );
  }
}
