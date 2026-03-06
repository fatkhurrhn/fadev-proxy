export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    // ===== HOME PAGE =====
    if (url.pathname === '/' && !targetUrl) {
      return new Response(
        getHomePageHTML(),
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // ===== CHECK URL PARAMETER =====
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'Parameter ?url= is required',
          example: 'https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/posts/1'
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // ===== PROXY PROCESSING =====
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.text() 
          : undefined,
      });

      const modifiedHeaders = new Headers(response.headers);
      modifiedHeaders.set('Access-Control-Allow-Origin', '*');
      modifiedHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: modifiedHeaders,
      });

    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Fetch failed', message: error.message }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
  },
};

function getHomePageHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fadev Proxy 🚀</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
      background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      line-height: 1.6;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 2rem;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    .url-box {
      background: #0f172a;
      border-radius: 16px;
      padding: 1.25rem;
      border: 1px solid #334155;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      word-break: break-all;
      margin: 1.5rem 0;
    }
    .badge {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-right: 0.5rem;
    }
    .endpoint-demo {
      background: #1e293b;
      border-radius: 12px;
      padding: 1rem;
      margin: 1rem 0;
      border-left: 4px solid #3b82f6;
    }
    code {
      background: #0f172a;
      color: #a5f3fc;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      border: 1px solid #334155;
    }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 1.25rem;
      border-radius: 12px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      border: 1px solid #334155;
      margin: 1rem 0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }
    .feature-box {
      background: #1e293b;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #334155;
    }
    .feature-box h3 {
      color: #60a5fa;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }
    .try-link {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 40px;
      text-decoration: none;
      font-weight: 500;
      margin: 0.5rem 0;
      transition: all 0.2s;
    }
    .try-link:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    .warning-note {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid #f59e0b;
      border-radius: 12px;
      padding: 1rem;
      color: #fcd34d;
      margin: 1rem 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td, th {
      padding: 0.75rem;
      border-bottom: 1px solid #334155;
      text-align: left;
    }
    th {
      color: #60a5fa;
      font-weight: 600;
    }
    footer {
      text-align: center;
      color: #64748b;
      margin-top: 2rem;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>
        <span>🚀</span> 
        Fadev Proxy
      </h1>
      <div class="subtitle">
        Simple & Powerful Proxy for Scraping and CORS Bypass
      </div>

      <div class="url-box">
        <span class="badge">BASE URL</span>
        <code>https://fadev.proxyyy.workers.dev/?url=</code>
      </div>

      <div class="endpoint-demo">
        <strong>✨ Live Demos:</strong><br>
        <a href="/?url=https://jsonplaceholder.typicode.com/posts/1" class="try-link" target="_blank">
          📦 GET Post #1
        </a>
        <a href="/?url=https://jsonplaceholder.typicode.com/users" class="try-link" target="_blank">
          👥 GET Users
        </a>
        <a href="/?url=https://jsonplaceholder.typicode.com/comments?postId=1" class="try-link" target="_blank">
          💬 GET Comments
        </a>
      </div>
    </div>

    <!-- Scraping Guide -->
    <div class="card">
      <h2 style="color: #60a5fa; margin-bottom: 1rem;">🕷️ Web Scraping Guide</h2>
      
      <div class="warning-note">
        ⚠️ <strong>Important!</strong> For safe scraping, always use browser-like headers.
      </div>

      <h3 style="margin: 1.5rem 0 1rem;">🔧 Essential Headers for Scraping:</h3>
      
      <pre>{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.google.com/',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
}</pre>

      <div class="grid-2">
        <div class="feature-box">
          <h3>📌 Python Example</h3>
          <pre>import requests

url = "https://fadev.proxyyy.workers.dev/"
target = "https://jsonplaceholder.typicode.com/posts/1"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

response = requests.get(
    url, 
    params={'url': target},
    headers=headers
)

print(response.json())</pre>
        </div>

        <div class="feature-box">
          <h3>📌 JavaScript Example</h3>
          <pre>const fetch = require('node-fetch');

const proxyUrl = 'https://fadev.proxyyy.workers.dev/';
const target = 'https://jsonplaceholder.typicode.com/posts/1';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const response = await fetch(
  proxyUrl + '?url=' + encodeURIComponent(target),
  { headers }
);
const data = await response.json();
console.log(data);</pre>
        </div>
      </div>

      <h3 style="margin: 2rem 0 1rem;">🎯 Professional Scraping Tips:</h3>
      
      <table>
        <tr>
          <th>Technique</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><strong>Rotate User-Agent</strong></td>
          <td>Change User-Agent for each request to avoid bot detection</td>
        </tr>
        <tr>
          <td><strong>Request Delay</strong></td>
          <td>Add 2-5 seconds delay between requests to avoid overwhelming servers</td>
        </tr>
        <tr>
          <td><strong>Use Sessions</strong></td>
          <td>For websites that require login or cookies</td>
        </tr>
        <tr>
          <td><strong>Respect robots.txt</strong></td>
          <td>Always check scraping rules on target websites</td>
        </tr>
        <tr>
          <td><strong>Proxy Rotation</strong></td>
          <td>Use different proxies for large-scale scraping</td>
        </tr>
      </table>
    </div>

    <!-- API Reference -->
    <div class="card">
      <h2 style="color: #60a5fa; margin-bottom: 1rem;">📚 API Reference</h2>
      
      <h3 style="margin: 1rem 0;">Endpoint</h3>
      <pre>GET /?url={targetUrl}</pre>

      <h3 style="margin: 1.5rem 0 1rem;">Parameters</h3>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><code>url</code></td>
          <td>string</td>
          <td>✅</td>
          <td>Target URL to proxy</td>
        </tr>
      </table>

      <h3 style="margin: 1.5rem 0 1rem;">Response Headers</h3>
      <pre>Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization</pre>

      <h3 style="margin: 1.5rem 0 1rem;">Error Responses</h3>
      <table>
        <tr>
          <th>Status Code</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>400</td>
          <td>Missing <code>url</code> parameter</td>
        </tr>
        <tr>
          <td>500</td>
          <td>Failed to fetch target URL</td>
        </tr>
        <tr>
          <td>*</td>
          <td>Status code from target URL</td>
        </tr>
      </table>
    </div>

    <!-- Test Endpoints -->
    <div class="card">
      <h2 style="color: #60a5fa; margin-bottom: 1rem;">🧪 Test Endpoints</h2>
      <p>Try these endpoints for testing:</p>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div>
          <code>GET /?url=https://jsonplaceholder.typicode.com/posts/1</code>
        </div>
        <div>
          <code>GET /?url=https://jsonplaceholder.typicode.com/users</code>
        </div>
        <div>
          <code>GET /?url=https://jsonplaceholder.typicode.com/comments?postId=1</code>
        </div>
        <div>
          <code>GET /?url=https://api.github.com/users/octocat</code>
        </div>
        <div>
          <code>GET /?url=https://dog.ceo/api/breeds/image/random</code>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="card">
      <h2 style="color: #60a5fa; margin-bottom: 1rem;">✨ Features</h2>
      
      <div class="grid-2">
        <div class="feature-box">
          <h3>🔄 All HTTP Methods</h3>
          <p>Support for GET, POST, PUT, DELETE, OPTIONS, and more</p>
        </div>
        <div class="feature-box">
          <h3>🌐 CORS Enabled</h3>
          <p>Automatic CORS headers for all responses</p>
        </div>
        <div class="feature-box">
          <h3>📤 Header Forwarding</h3>
          <p>Forward custom headers like Authorization, Cookies, etc.</p>
        </div>
        <div class="feature-box">
          <h3>⚡ Fast & Reliable</h3>
          <p>Powered by Cloudflare Workers global network</p>
        </div>
      </div>
    </div>

    <footer>
      <p>🚀 Fadev Proxy • Cloudflare Workers • Ready for Scraping</p>
      <p style="margin-top: 0.5rem;">Base URL: https://fadev.proxyyy.workers.dev/?url=</p>
      <p style="margin-top: 1rem;">
        <a href="/" style="color: #60a5fa;">Home</a> • 
        <a href="https://github.com/username/fadev-proxy" style="color: #60a5fa;">GitHub</a> • 
        <a href="#" style="color: #60a5fa;">Documentation</a>
      </p>
    </footer>
  </div>
</body>
</html>`;
}
