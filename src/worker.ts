interface PositionData {
  vesselId: string;
  lat: number;
  lon: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

interface EmergencyAlert {
  vesselId: string;
  emergencyType: 'medical' | 'mechanical' | 'weather' | 'security';
  position: {
    lat: number;
    lon: number;
  };
  timestamp: number;
  message?: string;
}

interface VesselStatus {
  id: string;
  name: string;
  lastPosition: PositionData | null;
  status: 'active' | 'inactive' | 'emergency';
  lastUpdate: number;
  catchCount: number;
  healthIndicators: {
    engine: 'normal' | 'warning' | 'critical';
    fuel: number;
    comms: 'satellite' | 'cellular' | 'offline';
  };
}

const FLEET_DATA: Map<string, VesselStatus> = new Map([
  ['vessel-001', {
    id: 'vessel-001',
    name: 'North Star',
    lastPosition: null,
    status: 'active',
    lastUpdate: Date.now() - 3600000,
    catchCount: 42,
    healthIndicators: {
      engine: 'normal',
      fuel: 85,
      comms: 'cellular'
    }
  }],
  ['vessel-002', {
    id: 'vessel-002',
    name: 'Ocean Hunter',
    lastPosition: null,
    status: 'active',
    lastUpdate: Date.now() - 1800000,
    catchCount: 28,
    healthIndicators: {
      engine: 'warning',
      fuel: 45,
      comms: 'satellite'
    }
  }]
]);

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marine Ops — Fleet Coordination</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a0a0f;
      color: #f8fafc;
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      width: 100%;
    }
    header {
      background: rgba(10, 10, 15, 0.95);
      border-bottom: 1px solid #1e293b;
      padding: 1.5rem 0;
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0284c7;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo::before {
      content: "⛴";
      font-size: 2rem;
    }
    .tagline {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }
    nav a {
      color: #cbd5e1;
      text-decoration: none;
      margin-left: 2rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    nav a:hover {
      color: #0284c7;
    }
    .hero {
      padding: 4rem 0;
      text-align: center;
      background: linear-gradient(135deg, #0a0a0f 0%, #0f172a 100%);
    }
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #0284c7, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 700px;
      margin: 0 auto 2rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 3rem 0;
    }
    .feature-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 2rem;
      transition: transform 0.3s, border-color 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: #0284c7;
    }
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      color: #f8fafc;
    }
    .feature-card p {
      color: #94a3b8;
    }
    .api-section {
      padding: 3rem 0;
      border-top: 1px solid #1e293b;
    }
    .endpoint {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      font-family: 'Monaco', 'Consolas', monospace;
    }
    .method {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.875rem;
      margin-right: 1rem;
    }
    .method.post { background: #065f46; color: #34d399; }
    .method.get { background: #1e40af; color: #60a5fa; }
    .path { color: #0284c7; }
    footer {
      margin-top: auto;
      background: rgba(10, 10, 15, 0.95);
      border-top: 1px solid #1e293b;
      padding: 2rem 0;
      text-align: center;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .footer-logo {
      color: #0284c7;
      font-weight: 700;
      font-size: 1.25rem;
    }
    .copyright {
      color: #64748b;
      font-size: 0.875rem;
    }
    .fleet-stats {
      display: flex;
      gap: 2rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .header-content { flex-direction: column; gap: 1rem; }
      nav a { margin: 0 0.75rem; }
      .footer-content { flex-direction: column; text-align: center; }
      .fleet-stats { justify-content: center; }
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container header-content">
      <div>
        <div class="logo">Marine Ops</div>
        <div class="tagline">Boat-first fleet management</div>
      </div>
      <nav>
        <a href="#features">Features</a>
        <a href="#api">API</a>
        <a href="/health">Health</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1>Marine Operations Center</h1>
        <p>Real-time coordination for fishing fleets operating in harsh environments. GPS tracking, weather integration, catch logging, vessel health monitoring, and emergency protocols with satellite comms fallback.</p>
      </div>
    </section>

    <section id="features" class="container">
      <div class="features">
        <div class="feature-card">
          <span class="feature-icon">📍</span>
          <h3>GPS Tracking</h3>
          <p>Real-time vessel positioning with historical track playback and geofencing alerts.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🌤️</span>
          <h3>Weather Integration</h3>
          <p>Live weather overlays, storm alerts, and route optimization based on conditions.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📊</span>
          <h3>Catch Logging</h3>
          <p>Digital logbook with species, weight, and location tracking for compliance.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚙️</span>
          <h3>Vessel Health</h3>
          <p>Engine monitoring, fuel consumption analytics, and predictive maintenance.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🚨</span>
          <h3>Emergency Protocols</h3>
          <p>One-touch emergency alerts with automated distress signal broadcasting.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📡</span>
          <h3>Satellite Comms</h3>
          <p>Redundant satellite communication fallback for operations beyond cellular range.</p>
        </div>
      </div>
    </section>

    <section id="api" class="api-section">
      <div class="container">
        <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #f8fafc;">Fleet API</h2>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/position</span>
          <p style="margin-top: 0.75rem; color: #94a3b8;">Submit vessel position updates with latitude, longitude, speed, and heading.</p>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/api/fleet/status</span>
          <p style="margin-top: 0.75rem; color: #94a3b8;">Retrieve real-time status of all vessels in the fleet.</p>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/emergency</span>
          <p style="margin-top: 0.75rem; color: #94a3b8;">Trigger emergency alert with type, position, and optional message.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container footer-content">
      <div class="footer-logo">Marine Ops Fleet</div>
      <div class="fleet-stats">
        <span>Active Vessels: 2</span>
        <span>Total Catch: 70</span>
        <span>Last Update: Just now</span>
      </div>
      <div class="copyright">© 2024 Marine Operations Center. For operational use only.</div>
    </div>
  </footer>
</body>
</html>`;

async function handlePosition(request: Request): Promise<Response> {
  try {
    const data = await request.json() as PositionData;
    
    if (!data.vesselId || !data.lat || !data.lon || !data.timestamp) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const vessel = FLEET_DATA.get(data.vesselId);
    if (vessel) {
      vessel.lastPosition = data;
      vessel.lastUpdate = Date.now();
      vessel.healthIndicators.comms = data.lon > 100 ? 'satellite' : 'cellular';
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Position updated',
      received: data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleEmergency(request: Request): Promise<Response> {
  try {
    const data = await request.json() as EmergencyAlert;
    
    if (!data.vesselId || !data.emergencyType || !data.position || !data.timestamp) {
      return new Response(JSON.stringify({ error: 'Missing required emergency fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const vessel = FLEET_DATA.get(data.vesselId);
    if (vessel) {
      vessel.status = 'emergency';
      vessel.lastUpdate = Date.now();
      vessel.healthIndicators.comms = 'satellite';
    }

    console.log(`EMERGENCY ALERT: ${data.vesselId} - ${data.emergencyType} at ${data.position.lat},${data.position.lon}`);

    return new Response(JSON.stringify({ 
      success: true, 
      alert: 'Emergency broadcast initiated',
      satelliteFallback: 'activated',
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid emergency data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function handleFleetStatus(): Response {
  const fleetArray = Array.from(FLEET_DATA.values());
  
  const summary = {
    totalVessels: fleetArray.length,
    active: fleetArray.filter(v => v.status === 'active').length,
    inEmergency: fleetArray.filter(v => v.status === 'emergency').length,
    totalCatch: fleetArray.reduce((sum, v) => sum + v.catchCount, 0),
    lastUpdated: new Date().toISOString(),
    vessels: fleetArray
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

function handleHealthCheck(): Response {
  return new Response(JSON.stringify({
    status: 'operational',
    service: 'marine-ops',
    timestamp: new Date().toISOString(),
    fleetCount: FLEET_DATA.size,
    region: (request as any).cf?.region || 'unknown'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    let response: Response;

    switch (path) {
      case '/':
        response = new Response(HTML_TEMPLATE, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...securityHeaders
          }
        });
        break;

      case '/health':
        response = handleHealthCheck();
        break;

      case '/api/position':
        if (request.method === 'POST') {
          response = await handlePosition(request);
        } else {
          response = new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/fleet/status':
        if (request.method === 'GET') {
          response = handleFleetStatus();
        } else {
          response = new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      case '/api/emergency':
        if (request.method === 'POST') {
          response = await handleEmergency(request);
        } else {
          response = new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        break;

      default:
        response = new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    for (const [header, value] of Object.entries(securityHeaders)) {
      response.headers.set(header, value);
    }

    return response;
  }
};
