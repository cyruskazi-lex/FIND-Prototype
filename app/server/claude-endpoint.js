// Fumana backend: LLM proxy — provider-agnostic.
//
// The browser always calls POST /api/claude with { system, messages } and gets
// back { text }. The provider is chosen entirely by environment variables, so
// switching between Anthropic, OpenAI, or another provider is a config change
// with NO app-code edits. The key is read server-side (non VITE_, never bundled),
// the same rule as the Anthropic key in docs/api_integration_notes.md:
//
//   Browser  ->  Fumana backend (holds the key)  ->  LLM provider
//
// Env:
//   LLM_PROVIDER  anthropic | openai   (unset -> proxy is inert, returns 501)
//   LLM_API_KEY   the chosen provider's key
//   LLM_MODEL     optional model override (else a per-provider default)
//
// To add a provider, add one entry to PROVIDERS below. The route, the request
// shape, and the { text } response shape never change.

const MAX_TOKENS = 1024;

// Each adapter takes the normalized request and returns { status, text?, error? }.
// The app-facing contract ({ system, messages } in, { text } out) is identical
// across providers; each adapter maps to/from its provider's own shape here.
const PROVIDERS = {
  anthropic: {
    defaultModel: "claude-sonnet-4-6",
    async call({ key, model, system, messages }) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: MAX_TOKENS, ...(system ? { system } : {}), messages }),
      });
      const data = await r.json();
      if (!r.ok) return { status: r.status, error: data?.error?.message || "provider error" };
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      return { status: 200, text };
    },
  },
  openai: {
    defaultModel: "gpt-4o-mini",
    async call({ key, model, system, messages }) {
      // OpenAI carries the system prompt as a leading message.
      const chat = [...(system ? [{ role: "system", content: system }] : []), ...messages];
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, max_tokens: MAX_TOKENS, messages: chat }),
      });
      const data = await r.json();
      if (!r.ok) return { status: r.status, error: data?.error?.message || "provider error" };
      const text = (data.choices?.[0]?.message?.content || "").trim();
      return { status: 200, text };
    },
  },
};

function makeHandler(env) {
  const send = (res, status, obj) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(obj));
  };
  return async (req, res) => {
    if (req.method !== "POST") { res.statusCode = 405; res.end("Method Not Allowed"); return; }
    try {
      const providerName = (env.LLM_PROVIDER || "").trim().toLowerCase();
      const key = env.LLM_API_KEY;
      // Inert until BOTH a provider and a key are configured.
      if (!providerName || !key) return send(res, 501, { error: "LLM provider is not configured on the server" });
      const provider = PROVIDERS[providerName];
      if (!provider) return send(res, 500, { error: `Unknown LLM_PROVIDER "${providerName}"` });

      const chunks = [];
      for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      const messages = Array.isArray(body.messages) ? body.messages : [];
      if (!messages.length) return send(res, 400, { error: "Missing messages" });
      const system = body.system ? String(body.system) : "";
      const model = (env.LLM_MODEL || "").trim() || provider.defaultModel;

      const out = await provider.call({ key, model, system, messages });
      if (out.status !== 200) return send(res, out.status, { error: out.error || "provider error" });
      return send(res, 200, { text: out.text || "" });
    } catch {
      // Never log the key or the request body; a short server-side line only.
      console.error("[claude] request failed");
      return send(res, 500, { error: "LLM request failed" });
    }
  };
}

// Vite plugin: mounts POST /api/claude on both the dev and preview servers.
export function claudeEndpoint(env) {
  return {
    name: "fumana-claude-endpoint",
    configureServer(server) { server.middlewares.use("/api/claude", makeHandler(env)); },
    configurePreviewServer(server) { server.middlewares.use("/api/claude", makeHandler(env)); },
  };
}
