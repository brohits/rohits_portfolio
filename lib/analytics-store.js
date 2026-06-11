import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const LOCAL_FILE = process.env.VERCEL
  ? path.join("/tmp", "portfolio-analytics.json")
  : path.join(process.cwd(), "data", "analytics.json");
const BLOB_PATHNAME = "portfolio-analytics/events.json";
const MAX_EVENTS = 5000;

function trimEvents(events) {
  return events.slice(-MAX_EVENTS);
}

async function readLocalEvents() {
  if (!existsSync(LOCAL_FILE)) {
    return [];
  }

  const raw = await readFile(LOCAL_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.events) ? parsed.events : [];
}

async function writeLocalEvents(events) {
  const dir = path.dirname(LOCAL_FILE);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(
    LOCAL_FILE,
    JSON.stringify({ events: trimEvents(events), updatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}

async function readBlobEvents() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const response = await fetch(
    `https://blob.vercel-storage.com/${BLOB_PATHNAME}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Blob read failed (${response.status})`);
  }

  const parsed = await response.json();
  return Array.isArray(parsed.events) ? parsed.events : [];
}

async function writeBlobEvents(events) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return false;

  const body = JSON.stringify({
    events: trimEvents(events),
    updatedAt: new Date().toISOString(),
  });

  const response = await fetch(
    `https://blob.vercel-storage.com/${BLOB_PATHNAME}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-api-version": "7",
        "x-content-type": "application/json",
      },
      body,
    }
  );

  if (!response.ok) {
    throw new Error(`Blob write failed (${response.status})`);
  }

  return true;
}

export async function loadEvents() {
  try {
    const blobEvents = await readBlobEvents();
    if (blobEvents !== null) {
      return blobEvents;
    }
  } catch {
    /* fall through to local file */
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
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "vercel-tmp";
  return "local";
}
