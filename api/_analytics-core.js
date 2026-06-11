const BLOB_PATHNAME = "portfolio-analytics-events.json";
const KV_KEY = "portfolio-analytics-events";
const MAX_EVENTS = 5000;
const PASSWORD = process.env.ANALYTICS_PASSWORD || "9589";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Analytics-Key",
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

function trimEvents(events) {
  return events.slice(-MAX_EVENTS);
}

function hasBlobToken() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
  );
}

function hasKv() {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

function isVercel() {
  return Boolean(process.env.VERCEL);
}

function shouldTryBlob() {
  return hasBlobToken() || isVercel();
}

function isBlobConfigError(error) {
  const message = String(error?.message || error).toLowerCase();
  return (
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("not configured") ||
    message.includes("store")
  );
}

async function readBlobEvents() {
  if (!shouldTryBlob()) {
    return null;
  }

  try {
    const { get } = await import("@vercel/blob");
    const result = await get(BLOB_PATHNAME, { access: "private" });
    if (!result) return [];

    const text = await result.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.events) ? parsed.events : [];
  } catch (error) {
    const message = String(error?.message || error).toLowerCase();
    if (
      message.includes("not found") ||
      message.includes("does not exist")
    ) {
      return [];
    }
    if (isBlobConfigError(error)) {
      return null;
    }
    throw error;
  }
}

async function writeBlobEvents(events) {
  if (!shouldTryBlob()) {
    return false;
  }

  try {
    const { put } = await import("@vercel/blob");
    await put(
      BLOB_PATHNAME,
      JSON.stringify({
        events: trimEvents(events),
        updatedAt: new Date().toISOString(),
      }),
      {
        access: "private",
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "application/json",
      }
    );
    return true;
  } catch (error) {
    if (isBlobConfigError(error)) {
      return false;
    }
    throw error;
  }
}

async function readKvEvents() {
  if (!hasKv()) {
    return null;
  }

  const { kv } = await import("@vercel/kv");
  const data = await kv.get(KV_KEY);
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.events)) return data.events;
  return [];
}

async function writeKvEvents(events) {
  if (!hasKv()) {
    return false;
  }

  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, {
    events: trimEvents(events),
    updatedAt: new Date().toISOString(),
  });
  return true;
}

async function readLocalEvents() {
  if (isVercel()) {
    return [];
  }

  const { existsSync } = await import("node:fs");
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");

  const localFile = path.join(process.cwd(), "data", "analytics.json");
  if (!existsSync(localFile)) {
    return [];
  }

  const raw = await readFile(localFile, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.events) ? parsed.events : [];
}

async function writeLocalEvents(events) {
  if (isVercel()) {
    return;
  }

  const { existsSync, mkdirSync } = await import("node:fs");
  const { writeFile } = await import("node:fs/promises");
  const path = await import("node:path");

  const localFile = path.join(process.cwd(), "data", "analytics.json");
  const dir = path.dirname(localFile);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await writeFile(
    localFile,
    JSON.stringify(
      { events: trimEvents(events), updatedAt: new Date().toISOString() },
      null,
      2
    ),
    "utf8"
  );
}

async function loadEvents() {
  const blobEvents = await readBlobEvents();
  if (blobEvents !== null) {
    return blobEvents;
  }

  const kvEvents = await readKvEvents();
  if (kvEvents !== null) {
    return kvEvents;
  }

  return readLocalEvents();
}

async function saveEvents(events) {
  const trimmed = trimEvents(events);

  if (await writeBlobEvents(trimmed).catch(() => false)) {
    return "blob";
  }

  if (await writeKvEvents(trimmed).catch(() => false)) {
    return "kv";
  }

  if (!isVercel()) {
    await writeLocalEvents(trimmed);
    return "local";
  }

  return null;
}

async function appendEvent(event) {
  const events = await loadEvents();
  events.push(event);
  const mode = await saveEvents(events);
  return { event, saved: Boolean(mode), storage: mode };
}

async function clearEvents() {
  return saveEvents([]);
}

function getStorageMode() {
  if (hasBlobToken() || isVercel()) return hasBlobToken() ? "blob" : "blob (connect store)";
  if (hasKv()) return "kv";
  if (isVercel()) return "none";
  return "local";
}

function getStorageWarning() {
  if (hasBlobToken() || hasKv()) return "";
  if (!isVercel()) return "";
  return "Connect Vercel Blob: Project → Storage → Create Blob → link to this project → Redeploy. Visits cannot be saved until then.";
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
  try {
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
    const userAgent =
      payload.userAgent || request.headers.get("user-agent") || "";

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

    const result = await appendEvent(event);
    return jsonResponse({
      ok: true,
      saved: result.saved,
      storage: result.storage,
    });
  } catch (error) {
    console.error("track error", error);
    return jsonResponse({ error: error?.message || "Failed to save event" }, 500);
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
        storageWarning: getStorageWarning(),
        storageReady: Boolean(hasBlobToken() || hasKv() || !isVercel()),
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
