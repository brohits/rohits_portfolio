import { handleTrack } from "./_analytics-core.js";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: body?.length ? body : undefined,
    });

    const response = await handleTrack(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("track handler error", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error?.message || "Handler failed" }));
  }
}
