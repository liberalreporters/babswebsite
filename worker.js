const COOKIE_NAME = "babs_decap_state";

function securityHeaders(extra = {}) {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...extra,
  };
}

function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i >= 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

function randomState() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function callbackPage(status, payload, origin) {
  const message = "authorization:github:" + status + ":" + JSON.stringify(payload);
  const messageLiteral = JSON.stringify(message).replace(/</g, "\\u003c");
  const originLiteral = JSON.stringify(origin);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CMS Authentication</title></head><body><p>Completing secure CMS sign-in. You may close this window if it does not close automatically.</p><script>(function(){'use strict';var message=${messageLiteral};var allowedOrigin=${originLiteral};var completed=false;function receive(event){if(completed||event.origin!==allowedOrigin||!window.opener)return;completed=true;window.removeEventListener('message',receive,false);window.opener.postMessage(message,allowedOrigin);window.close();}window.addEventListener('message',receive,false);if(window.opener)window.opener.postMessage('authorizing:github',allowedOrigin);})();</script></body></html>`;
  return new Response(html, {
    status: status === "success" ? 200 : 400,
    headers: securityHeaders({
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    }),
  });
}

async function authStart(request, env) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: securityHeaders({ Allow: "GET" }) });
  }
  if (!env.GITHUB_OAUTH_CLIENT_ID) {
    return new Response("GitHub OAuth is not configured. Set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as Worker secrets.", {
      status: 503, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
    });
  }
  const url = new URL(request.url);
  const state = randomState();
  const callbackUrl = new URL("/api/callback", url.origin).toString();
  const query = new URLSearchParams({
    client_id: env.GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: callbackUrl,
    scope: "public_repo",
    state,
  });
  return Response.redirect("https://github.com/login/oauth/authorize?" + query.toString(), 302, {
    "Set-Cookie": `${COOKIE_NAME}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`,
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
  });
}

async function authCallback(request, env) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: securityHeaders({ Allow: "GET" }) });
  }
  const url = new URL(request.url);
  const origin = url.origin;
  const stateCookie = readCookie(request, COOKIE_NAME);
  const state = url.searchParams.get("state") || "";
  const clearCookie = `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0`;

  if (url.searchParams.has("error")) {
    const response = callbackPage("error", { message: "GitHub authorization was cancelled or denied." }, origin);
    response.headers.append("Set-Cookie", clearCookie);
    return response;
  }
  if (!stateCookie || !state || stateCookie !== state) {
    return new Response("OAuth state validation failed. Close this window and try signing in again.", {
      status: 400, headers: securityHeaders({ "Set-Cookie": clearCookie, "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  const code = url.searchParams.get("code") || "";
  if (!code || !env.GITHUB_OAUTH_CLIENT_ID || !env.GITHUB_OAUTH_CLIENT_SECRET) {
    return new Response("GitHub OAuth is not fully configured. Check Worker secrets and the GitHub OAuth App callback URL.", {
      status: 503, headers: securityHeaders({ "Set-Cookie": clearCookie, "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "BABS-Decap-CMS" },
      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: new URL("/api/callback", origin).toString(),
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      const response = callbackPage("error", { message: "GitHub token exchange failed. Check the OAuth App credentials and callback URL." }, origin);
      response.headers.append("Set-Cookie", clearCookie);
      return response;
    }
    const response = callbackPage("success", { token: tokenData.access_token, provider: "github" }, origin);
    response.headers.append("Set-Cookie", clearCookie);
    return response;
  } catch {
    const response = callbackPage("error", { message: "Unable to complete GitHub sign-in. Please try again." }, origin);
    response.headers.append("Set-Cookie", clearCookie);
    return response;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/auth") return authStart(request, env);
    if (url.pathname === "/api/callback") return authCallback(request, env);
    if (url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404, headers: securityHeaders() });
    }
    return env.ASSETS.fetch(request);
  },
};
