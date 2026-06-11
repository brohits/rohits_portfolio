import { get, put } from "@vercel/blob";

const BLOB_PATHNAME = "portfolio-analytics/events.json";
const MAX_EVENTS = 5000;

function trimEvents(events) {
  return events.slice(-MAX_EVENTS);
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercel() {
  return Boolean(process.env.VERCEL);
}

async function readBlobEvents() {
  if (!hasBlobToken()) {
    return null;
  }

  try {
    const result = await get(BLOB_PATHNAME, { access: "private" });
    if (!result) return [];

    const text = await result.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.events) ? parsed.events : [];
  } catch (error) {
    if (error?.message?.toLowerCase().includes("not found")) {
      return [];
    }
    throw error;
  }
}

async function writeBlobEvents(events) {
  if (!hasBlobToken()) {
    return false;
  }

  await put(
    BLOB_PATHNAME,
    JSON.stringify({
      events: trimEvents(events),
      updatedAt: new Date().toISOString(),
    }),
    {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    }
  );

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

export async function loadEvents() {
  const blobEvents = await readBlobEvents();
  if (blobEvents !== null) {
    return blobEvents;
  }

  return readLocalEvents();
}

export async function appendEvent(event) {
  const events = await loadEvents();
  events.push(event);
  const trimmed = trimEvents(events);

  const wroteBlob = await writeBlobEvents(trimmed).catch(() => false);
  if (!wroteBlob) {
    await writeLocalEvents(trimmed);
  }

  return event;
}

export async function clearEvents() {
  const wroteBlob = await writeBlobEvents([]).catch(() => false);
  if (!wroteBlob) {
    await writeLocalEvents([]);
  }
}

export function getStorageMode() {
  if (hasBlobToken()) return "blob";
  if (isVercel()) return "vercel (add Blob store)";
  return "local";
}
