import { handleAnalytics, handleTrack } from "../api/_analytics-core.js";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function toWebRequest(req, body) {
  const host = req.headers.host || "localhost";
  const url = `http://${host}${req.url}`;

  return new Request(url, {
    method: req.method,
    headers: req.headers,
    body: body?.length ? body : undefined,
  });
}

async function sendResponse(webResponse, res) {
  res.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const text = await webResponse.text();
  res.end(text);
}

export function analyticsApiPlugin() {
  return {
    name: "analytics-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];

        if (url === "/api/track") {
          const body = await readBody(req);
          const response = await handleTrack(toWebRequest(req, body));
          await sendResponse(response, res);
          return;
        }

        if (url === "/api/analytics") {
          const body =
            req.method === "DELETE" || req.method === "POST"
              ? await readBody(req)
              : undefined;
          const response = await handleAnalytics(toWebRequest(req, body));
          await sendResponse(response, res);
          return;
        }

        next();
      });
    },
  };
}
