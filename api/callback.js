const SITE_ORIGIN = "https://babatundeogunlade.com";
function cookieValue(header, name) {
  for (const part of String(header || "").split(";")) {
    const index = part.indexOf("=");
    if (index >= 0 && part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return "";
}
function callbackPage(status, payload) {
  const message = "authorization:github:" + status + ":" + JSON.stringify(payload);
  const messageLiteral = JSON.stringify(message).replace(/</g, "\\u003c");
  const originLiteral = JSON.stringify(SITE_ORIGIN);
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>CMS Authentication</title></head><body><p>Completing secure CMS sign-in. You may close this window if it does not close automatically.</p><script>(function(){'use strict';var message=" +
    messageLiteral + ";var allowedOrigin=" + originLiteral + ";var completed=false;function receive(event){if(completed||event.origin!==allowedOrigin||!window.opener)return;completed=true;window.removeEventListener('message',receive,false);window.opener.postMessage(message,allowedOrigin);window.close();}window.addEventListener('message',receive,false);if(window.opener)window.opener.postMessage('authorizing:github',allowedOrigin);})();</script></body></html>";
}
module.exports = async function callback(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }
  const stateCookie = cookieValue(req.headers.cookie, "babs_decap_state");
  const state = String(req.query.state || "");
  res.setHeader("Set-Cookie", "babs_decap_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0");
  if (req.query.error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(400).send(callbackPage("error", { message: "GitHub authorization was cancelled or denied." }));
  }
  if (!stateCookie || !state || stateCookie !== state) {
    return res.status(400).send("OAuth state validation failed. Close this window and try signing in again.");
  }
  const code = String(req.query.code || "");
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!code || !clientId || !clientSecret) {
    return res.status(503).send("GitHub OAuth is not fully configured. Check the Vercel environment variables and GitHub OAuth App callback URL.");
  }
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "User-Agent": "BABS-Decap-CMS" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(502).send(callbackPage("error", { message: "GitHub token exchange failed. Check the OAuth App credentials and callback URL." }));
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(callbackPage("success", { token: tokenData.access_token, provider: "github" }));
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(502).send(callbackPage("error", { message: "Unable to complete GitHub sign-in. Please try again." }));
  }
};
