// ScaleSolving billing check. Shows a "temporarily unavailable" page while this
// site is paused for an unpaid invoice. No secrets, no dependencies.
// Works with Vercel Routing Middleware on any framework (static, Vite, CRA, Next.js <= 15;
// for Next.js 16+ put the same code in proxy.ts and export it as `proxy`).
//
// Fails open: if the check is slow or errors, the site serves normally.

const PROJECT_KEY = "el3vn-typeform"; // this site's Vercel project name
const STATUS_URL = "https://billing-guard-scalesolving.vercel.app/api/status/";
const CACHE_MS = 30_000;

let cached = { at: 0, suspended: false };

export default async function middleware(request) {
  // Only real page loads in production; assets, APIs and previews pass straight through.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return;
  if (request.method !== "GET") return;
  if (!(request.headers.get("accept") || "").includes("text/html")) return;

  if (Date.now() - cached.at > CACHE_MS) {
    try {
      const res = await fetch(STATUS_URL + PROJECT_KEY, { signal: AbortSignal.timeout(1500) });
      const data = res.ok ? await res.json() : { suspended: false };
      cached = { at: Date.now(), suspended: data.suspended === true };
    } catch {
      cached = { at: Date.now(), suspended: false };
    }
  }
  if (!cached.suspended) return;

  return new Response(SUSPENDED_HTML, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "3600",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  matcher: "/((?!api/|assets/|_next/|static/|favicon).*)",
};

const SUSPENDED_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Temporarily unavailable</title>
<style>
  :root { color-scheme: light dark; --bg:#fafafa; --fg:#18181b; --muted:#71717a; --line:#e4e4e7; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0b0b0c; --fg:#f4f4f5; --muted:#a1a1aa; --line:#27272a; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--fg);
         font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; padding:24px; }
  main { max-width: 420px; text-align:center; }
  .dot { width:10px; height:10px; border-radius:50%; background:#f59e0b; margin:0 auto 24px; box-shadow:0 0 0 6px rgba(245,158,11,.18); }
  h1 { font-size: 24px; font-weight: 650; letter-spacing:-0.01em; margin:0 0 12px; }
  p { color: var(--muted); line-height:1.6; margin:0 0 8px; font-size:15px; }
  footer { margin-top: 32px; padding-top: 16px; border-top:1px solid var(--line); font-size:13px; color:var(--muted); }
  a { color: inherit; }
</style>
</head>
<body>
<main>
  <div class="dot" aria-hidden="true"></div>
  <h1>This site is temporarily unavailable</h1>
  <p>We're working to restore it. Please check back soon.</p>
  <footer>Site owner? Contact <a href="mailto:hello@scalesolving.com">hello@scalesolving.com</a></footer>
</main>
</body>
</html>`;
