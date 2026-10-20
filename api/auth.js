const crypto = require("crypto");
const SITE_ORIGIN = "https://babatundeogunlade.com";
const CALLBACK_URL = SITE_ORIGIN + "/api/callback";

module.exports = function auth(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(503).send("GitHub OAuth is not configured. Add GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET in Vercel project environment variables.");
  }
  const state = crypto.randomBytes(32).toString("hex");
  res.setHeader("Set-Cookie", "babs_decap_state=" + state + "; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600");
  const query = new URLSearchParams({ client_id: clientId, redirect_uri: CALLBACK_URL, scope: "public_repo", state });
  return res.redirect(302, "https://github.com/login/oauth/authorize?" + query.toString());
};
