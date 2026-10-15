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
          example: 'https://fadev.proxyyy.workers.dev/?url=https://example.com'
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

    // ===== PROXY PROCESSING WITH CSS FIX =====
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
          'Accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
          'Referer': request.headers.get('referer') || targetUrl,
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.text() 
          : undefined,
      });

      const modifiedHeaders = new Headers(response.headers);
      modifiedHeaders.set('Access-Control-Allow-Origin', '*');
      modifiedHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // ===== FIX UNTUK CSS, JS, GAMBAR =====
      const contentType = response.headers.get('content-type') || '';
      
      // Kalau HTML, rewrite semua URL relatif
      if (contentType.includes('text/html')) {
        let html = await response.text();
        
        // Parse target URL untuk base
        const targetUrlObj = new URL(targetUrl);
        const baseUrl = `${targetUrlObj.protocol}//${targetUrlObj.host}`;
        
        // 1. Inject BASE tag biar semua relative path ngerti
        html = html.replace(
          '<head>',
          `<head>\n<base href="${baseUrl}/">\n<!-- Proxy: Fadev Proxy -->`
        );
        
        // 2. Rewrite semua URL di href, src, dan yang lainnya
        html = html.replace(
          /(href|src|action|data)="(?!http|\/\/|#|\?|mailto:|tel:|javascript:)([^"]*)"/g,
          (match, attr, path) => {
            // Skip kalau udah absolute atau special protocols
            if (path.startsWith('http') || path.startsWith('//')) return match;
            
            // Bersihin path dari leading slash
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            
            // Encode path buat proxy
            const encodedPath = encodeURIComponent(`${baseUrl}/${cleanPath}`);
            
            return `${attr}="/?url=${encodedPath}"`;
          }
        );
        
        // 3. Rewrite CSS @import dan url() di style tags
        html = html.replace(
          /<style[^>]*>([\s\S]*?)<\/style>/gi,
          (match, cssContent) => {
            const fixedCss = cssContent.replace(
              /url\(['"]?([^'"()]*)['"]?\)/g,
              (urlMatch, cssPath) => {
                if (cssPath.startsWith('http') || cssPath.startsWith('//')) return urlMatch;
                const cleanPath = cssPath.startsWith('/') ? cssPath.slice(1) : cssPath;
                const encodedPath = encodeURIComponent(`${baseUrl}/${cleanPath}`);
                return `url(/?url=${encodedPath})`;
              }
            );
            return `<style>${fixedCss}</style>`;
          }
        );
        
        // 4. Rewrite inline style
        html = html.replace(
          /style="([^"]*)"/g,
          (match, styleContent) => {
            const fixedStyle = styleContent.replace(
              /url\(['"]?([^'"()]*)['"]?\)/g,
              (urlMatch, cssPath) => {
                if (cssPath.startsWith('http') || cssPath.startsWith('//')) return urlMatch;
                const cleanPath = cssPath.startsWith('/') ? cssPath.slice(1) : cssPath;
                const encodedPath = encodeURIComponent(`${baseUrl}/${cleanPath}`);
                return `url(/?url=${encodedPath})`;
              }
            );
            return `style="${fixedStyle}"`;
          }
        );
        
        return new Response(html, {
          status: response.status,
          headers: modifiedHeaders
        });
      }
      
      // Kalau CSS, rewrite URL di dalamnya
      if (contentType.includes('text/css')) {
        let css = await response.text();
        const targetUrlObj = new URL(targetUrl);
        const baseUrl = `${targetUrlObj.protocol}//${targetUrlObj.host}`;
        
        css = css.replace(
          /url\(['"]?([^'"()]*)['"]?\)/g,
          (match, cssPath) => {
            if (cssPath.startsWith('http') || cssPath.startsWith('//') || cssPath.startsWith('data:')) return match;
            const cleanPath = cssPath.startsWith('/') ? cssPath.slice(1) : cssPath;
            const absolutePath = cssPath.startsWith('/') 
              ? `${baseUrl}${cssPath}`
              : `${baseUrl}/${cleanPath}`;
            return `url(/?url=${encodeURIComponent(absolutePath)})`;
          }
        );
        
        return new Response(css, {
          status: response.status,
          headers: modifiedHeaders
        });
      }

      // Untuk file lain (gambar, js, dll) langsung kirim
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
    .try-link {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 40px;
      text-decoration: none;
      font-weight: 500;
      margin: 0.5rem 0.5rem 0.5rem 0;
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
    footer {
      text-align: center;
      color: #64748b;
      margin-top: 2rem;
      font-size: 0.9rem;
    }
    code {
      background: #0f172a;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>🚀 Fadev Proxy</h1>
      <div class="subtitle">Full Website Proxy with CSS & Assets Support</div>
      
      <div class="url-box">
        <span class="badge">BASE URL</span>
        <code>https://fadev.proxyyy.workers.dev/?url=</code>
      </div>

      <div class="warning-note">
        ⚡ <strong>Now with CSS Support!</strong> Websites will look exactly like the original.
      </div>

      <h3 style="margin: 1.5rem 0 1rem;">🎯 Try These Websites:</h3>
      <a href="/?url=https://example.com" class="try-link" target="_blank">🌐 Example.com</a>
      <a href="/?url=https://neverssl.com" class="try-link" target="_blank">🔒 NeverSSL</a>
      <a href="/?url=https://httpbin.org/html" class="try-link" target="_blank">📄 HTTPBin HTML</a>
      <a href="/?url=https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/posts/1" class="try-link" target="_blank">📦 JSON Test</a>
    </div>

    <div class="card">
      <h2 style="color: #60a5fa; margin-bottom: 1rem;">✨ New Features</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
        <div style="background: #1e293b; padding: 1rem; border-radius: 12px;">
          <strong>🎨 Full CSS Support</strong>
          <p style="color: #94a3b8; margin-top: 0.5rem;">External, inline, and @import CSS all work</p>
        </div>
        <div style="background: #1e293b; padding: 1rem; border-radius: 12px;">
          <strong>🖼️ Images & Assets</strong>
          <p style="color: #94a3b8; margin-top: 0.5rem;">All images, fonts, and media files load properly</p>
        </div>
        <div style="background: #1e293b; padding: 1rem; border-radius: 12px;">
          <strong>🔗 Relative URLs Fixed</strong>
          <p style="color: #94a3b8; margin-top: 0.5rem;">All relative paths are rewritten automatically</p>
        </div>
        <div style="background: #1e293b; padding: 1rem; border-radius: 12px;">
          <strong>⚡ Fast & Reliable</strong>
          <p style="color: #94a3b8; margin-top: 0.5rem;">Powered by Cloudflare Workers global network</p>
        </div>
      </div>
    </div>

    <footer>
      <p>🚀 Fadev Proxy • Full Website Proxy with CSS Support</p>
      <p style="margin-top: 0.5rem;">Base URL: https://fadev.proxyyy.workers.dev/?url=</p>
    </footer>
  </div>
</body>
</html>`;
}