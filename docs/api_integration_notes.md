# Fumana API and integration notes

How the demo talks to Claude, and what changes when this becomes a real product. Read this before wiring the backend.

Powered by Telos. Designed by Lexington Advisory Group.

---

## Read this first: the prototype is not production-safe

The prototype calls the Anthropic API directly from the browser with no API key. That works only inside the Claude artifact sandbox, which injects credentials. In a real deployment this breaks, and shipping a key to the browser would expose it to anyone.

**Production rule: the browser never holds the key.** The frontend calls your own backend. Your backend holds the Anthropic key as a server-side secret and calls Anthropic. The key lives in an environment variable, never in client code and never in the repo. The `.gitignore` already excludes `.env` for this reason.

```
Browser  ->  Fumana backend (holds the key)  ->  Anthropic API
```

---

## The call, as the prototype makes it

Endpoint: `POST https://api.anthropic.com/v1/messages`

Request body:
```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1000,
  "system": "the agent system prompt",
  "messages": [ { "role": "user", "content": "the input text" } ]
}
```

Response shape. Content is an array of blocks. Read the text blocks and join them:
```js
const text = (data.content || [])
  .filter(b => b.type === "text")
  .map(b => b.text)
  .join("\n")
  .trim();
```

For the structured agents, the prompt demands JSON only. Strip any stray fences before parsing:
```js
const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
const obj = JSON.parse(clean);
```

---

## The four calls in the demo

| Call | Agent | Returns | Parse as |
| --- | --- | --- | --- |
| Beat 1 | Experience Alchemist | role, headline, outcomes, skills, integrity note | JSON |
| Beat 2 | Zuri | four to six sentences of reasoning | plain text |
| Beat 3 | Compliance, SOW | title, scope, deliverables, IP, EOR note, term | JSON |
| Beat 4 | Economics and Compliance | two labelled paragraphs | plain text |

Exact system prompts and input and output shapes are in `agents/agent_prompt_library.md`. Settings for every call: model `claude-sonnet-4-6`, `max_tokens` 1000.

---

## Where the data comes from

- **Demo:** one seeded scenario, held in a single constants object. One builder, one employer, one country, with illustrative figures marked as seeded.
- **Near-term build:** the seeded object is replaced by reads from the document store, against the entities in `docs/canonical_schema.md`. The call shapes do not change. Only the source of the inputs changes.

---

## The rule that does not bend

Figures with financial or impact meaning are computed in code from visible inputs. The model is never asked to produce a number. It narrates reasoning only. In the demo, the SROI math runs in the browser. In the build, it runs on the backend. Either way the model explains, it does not calculate. This is the single most important integration rule, because it is what lets the impact layer survive an investor asking where a number came from.

---

## Error handling

Every call is wrapped so a failure shows a recovery action, never a dead end. The same applies on the backend: a failed Anthropic call returns a clean error your frontend can retry, and it is logged server-side without logging the key or any masked PII.

---

## Connectors, for later

The platform can call partner services through MCP. Not needed for the demo. When it is, the backend adds an `mcp_servers` array to the request body. Out of scope for now, noted so it is not a surprise later.
