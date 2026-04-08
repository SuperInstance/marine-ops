const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Marine Ops</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#f8fafc;font-family:'Inter',sans-serif;min-height:100vh;padding:2rem;line-height:1.6}
.container{max-width:1000px;margin:0 auto}
.hero{text-align:center;padding:3rem 0}
h1{font-size:3rem;font-weight:700;margin-bottom:1rem;color:#0284c7}
.subtitle{font-size:1.25rem;color:#94a3b8;max-width:600px;margin:0 auto 2rem}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin:3rem 0}
.card{background:#1e293b;border-radius:12px;padding:1.5rem;border-left:4px solid #0284c7}
.card h3{color:#0284c7;margin-bottom:0.5rem}
.endpoints{background:#0f172a;border-radius:8px;padding:1.5rem;margin:2rem 0}
.ep{font-family:monospace;background:#1e293b;padding:0.5rem 1rem;border-radius:4px;margin:0.5rem 0;color:#94a3b8}
.footer{margin-top:4rem;text-align:center;color:#64748b;font-size:0.9rem}
.footer a{color:#0284c7;text-decoration:none}
</style></head><body><div class="container">
<div class="hero"><h1>Marine Ops</h1>
<p class="subtitle">Boat-first fleet management for harsh environments. GPS tracking, weather, catch logging, emergency protocols.</p></div>
<div class="features">
<div class="card"><h3>GPS Tracking</h3><p>Real-time vessel positions with satellite comms fallback.</p></div>
<div class="card"><h3>Weather Integration</h3><p>Marine forecasts, wave height, wind alerts for fleet routing.</p></div>
<div class="card"><h3>Emergency Protocol</h3><p>Man overboard, engine failure, mayday — automated response chains.</p></div>
<div class="card"><h3>Catch Logging</h3><p>Species tracking, quotas, compliance with fishery regulations.</p></div>
</div>
<div class="endpoints">
<h3 style="color:#0284c7;margin-bottom:1rem">API Endpoints</h3>
<div class="ep">POST /api/position - Update vessel position</div>
<div class="ep">GET /api/fleet/status - Fleet overview</div>
<div class="ep">POST /api/emergency - Trigger emergency protocol</div>
<div class="ep">GET /health - Liveness check</div>
</div>
<div class="footer">
<p>Part of the <a href="https://github.com/Lucineer/the-fleet">Cocapn fleet</a> - 100+ autonomous vessels.</p>
<p><i>Built with <a href="https://github.com/Lucineer/cocapn-ai">Cocapn</a>.</i></p>
<p>Superinstance &amp; Lucineer (DiGennaro et al.)</p>
</div></div></body></html>`;

const sh = {"Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'","X-Frame-Options":"DENY"};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
        headers: { "Content-Type": "application/json", ...sh }
      });
    }
    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8", ...sh }
    });
  }
};
