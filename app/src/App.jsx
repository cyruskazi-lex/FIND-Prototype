import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import zuriFace from "./assets/zuri/zuri-face.png";
import introVideo from "./assets/zuri/zuri-intro.mp4";
import q1Video from "./assets/zuri/zuri-q1.mp4";
import q2Video from "./assets/zuri/zuri-q2.mp4";
import q3Video from "./assets/zuri/zuri-q3.mp4";
import q4Video from "./assets/zuri/zuri-q4.mp4";
import q5Video from "./assets/zuri/zuri-q5.mp4";

// ============================================================
// Fumana platform. One application, one shared builder network.
// Build a candidate profile, switch to the employer side, and that
// same masked profile appears in search. Hire, and the impact computes.
// Zuri is the agent. Telos is the data and impact engine underneath.
// ============================================================

const T = {
  paper: "#ECEFF2", surface: "#FFFFFF", mute: "#E3E8EB", line: "#D7DEE3",
  ink: "#0C1A26", slate: "#5E6E7A", emerald: "#066E5A", vault: "#05564A",
  brass: "#B08A2E", onAccent: "#F4F7F8", alert: "#A8431F",
};
const F = { disp: "'Hanken Grotesk', sans-serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" };
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:rise .45s ease both}@keyframes grow{from{width:0}}
textarea,input{font-family:'Inter',sans-serif}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.dash{display:grid;grid-template-columns:1.4fr 1fr;gap:16px}
.mods{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.split{display:grid;grid-template-columns:1.3fr 1fr;gap:16px}
.doors{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:760px){.row2,.dash,.mods,.kanban,.split,.doors{grid-template-columns:1fr}}
button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #066E5A;outline-offset:2px}
@keyframes zuriPulse{0%{box-shadow:0 0 0 2px rgba(6,110,90,0.55),0 0 0 5px rgba(6,110,90,0.16)}50%{box-shadow:0 0 0 3px rgba(6,110,90,0.30),0 0 0 15px rgba(6,110,90,0)}100%{box-shadow:0 0 0 2px rgba(6,110,90,0.55),0 0 0 5px rgba(6,110,90,0.16)}}
@keyframes toastin{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
/* Carbon shell: dark header + dark left side nav, one shared component */
.fshell{height:100dvh;display:grid;grid-template-columns:248px 1fr;grid-template-rows:52px 1fr;grid-template-areas:"head head" "side main"}
.fshell.noNav{grid-template-columns:1fr;grid-template-areas:"head" "main"}
.fhead{grid-area:head;display:flex;align-items:center;gap:12px;background:#0C1A26;color:#EEF3F8;padding:0 16px}
.fbrand{font-family:'Hanken Grotesk',sans-serif;font-weight:800;font-size:18px;letter-spacing:3px;background:none;border:none;color:#fff;cursor:pointer;padding:0}
.fside{grid-area:side;background:#0C1A26;border-right:1px solid #12222E;display:flex;flex-direction:column;padding:10px 0;overflow-y:auto}
.fnav{text-align:left;background:none;border:none;border-left:3px solid transparent;color:#9FB0BC;font-family:'Inter',sans-serif;font-size:13.5px;padding:11px 18px;cursor:pointer;white-space:nowrap}
.fnav:hover{background:#12222E;color:#fff}
.fnav.on{background:#12222E;border-left-color:#066E5A;color:#fff;font-weight:600}
.fmain{grid-area:main;min-height:0;overflow-y:auto;background:#F2F4F7}
.fbot{display:none}
.ftoasts{position:fixed;top:64px;right:16px;z-index:70;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 32px)}
.ftoast{background:#0C1A26;color:#EEF3F8;border-left:3px solid #066E5A;border-radius:6px;padding:10px 14px;font-size:13px;box-shadow:0 8px 24px rgba(12,26,38,0.28);animation:toastin .25s ease}
.fdock{bottom:20px}
@media(max-width:880px){.fdock{bottom:76px}}
@media(max-width:880px){
  .fshell{grid-template-columns:1fr;grid-template-rows:52px 1fr;grid-template-areas:"head" "main"}
  .fshell.hasNav{grid-template-rows:52px 1fr 56px;grid-template-areas:"head" "main" "bot"}
  .fside{display:none}
  .fbot{grid-area:bot;display:flex;overflow-x:auto;background:#0C1A26;border-top:1px solid #12222E}
  .fbotItem{flex:0 0 auto;background:none;border:none;border-top:2px solid transparent;color:#9FB0BC;font-family:'Inter',sans-serif;font-size:11px;padding:8px 13px;cursor:pointer;white-space:nowrap}
  .fbotItem.on{color:#fff;border-top-color:#066E5A}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

// All model calls (scoring, the copilots, the Experience Alchemist) go through
// the provider-agnostic backend proxy. The browser never holds a provider key
// and never talks to a provider directly. Throws on a non-OK response so each
// caller's catch keeps the feature inert until a provider is configured.
async function callClaude({ system, messages, expectJson }) {
  const res = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error("llm " + res.status);
  const data = await res.json();
  const text = (data.text || "").trim();
  if (!expectJson) return text;
  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
}
const usd = n => "$" + Math.round(n).toLocaleString("en-US");

// ---- scoring model ----
const WEIGHTS = { "Technical depth": 0.30, "Communication clarity": 0.16, "Async and remote readiness": 0.16, "Professionalism": 0.14, "Collaboration": 0.12, "Problem solving": 0.12 };
const DIMENSIONS = Object.keys(WEIGHTS);
const EVIDENCE = {
  "Technical depth": "Your experience and your answers about real bugs and decisions.",
  "Communication clarity": "How clearly and directly you respond in the interview.",
  "Async and remote readiness": "How you handle time zones, handoffs, and going offline.",
  "Professionalism": "Commitments, follow through, and tone under pressure.",
  "Collaboration": "How you work with reviewers, peers, and juniors.",
  "Problem solving": "How you frame ambiguity and show your reasoning.",
};
const composite = dims => { let s = 0, w = 0; dims.forEach(d => { const wt = WEIGHTS[d.name] ?? 0.15; s += d.score * wt; w += wt; }); return Math.round(s / (w || 1)); };
const tierOf = s => s >= 85 ? { name: "Top 1%", color: T.emerald } : s >= 70 ? { name: "Gold", color: T.brass } : s >= 50 ? { name: "Silver", color: T.slate } : { name: "Bronze", color: T.alert };
const MODULES = {
  "Communication clarity": { id: "culture", title: "Culture Shock Simulator", blurb: "Western corporate communication: async updates, proactive clarification, direct feedback.", pts: 300 },
  "Async and remote readiness": { id: "async", title: "Async Operating Rhythm", blurb: "Run a remote day across time zones without losing momentum.", pts: 250 },
  "Professionalism": { id: "prof", title: "Professional Presence", blurb: "Client-ready conduct, commitments, and follow through.", pts: 200 },
  "Collaboration": { id: "collab", title: "Collaboration and Code Review", blurb: "Give and take review, pair effectively, raise blockers early.", pts: 220 },
  "Problem solving": { id: "solve", title: "Structured Problem Solving", blurb: "Frame ambiguous problems and show your reasoning.", pts: 240 },
  "Technical depth": { id: "deep", title: "Technical Deep Dive", blurb: "Close the gap on the skills employers ask for most.", pts: 320 },
};

// ---- seeded network so employer search has a pool ----
const SEED_BUILDERS = [
  { handle: "FB-2208", role: "Backend engineer", summary: "Built payment reconciliation and queue resilience for a Lagos fintech. Strong on PostgreSQL and network-loss recovery.", skills: ["Python", "PostgreSQL", "Distributed systems"], profileStrength: 88, tier: tierOf(88) },
  { handle: "FB-4417", role: "Frontend engineer", summary: "Shipped accessible React dashboards for a Nairobi health platform on low-bandwidth networks.", skills: ["React", "TypeScript", "Accessibility"], profileStrength: 81, tier: tierOf(81) },
  { handle: "FB-7731", role: "Data engineer", summary: "Built ETL and reporting pipelines across three African markets, owning data quality end to end.", skills: ["Airflow", "SQL", "Python"], profileStrength: 76, tier: tierOf(76) },
];

// ---- shared ui ----
function Btn({ children, onClick, kind, disabled, full, small }) {
  const s = { primary: { background: T.emerald, color: T.onAccent, border: "none" }, ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.line}` }, sso: { background: T.surface, color: T.ink, border: `1px solid ${T.line}` } }[kind || "primary"];
  return <button onClick={onClick} disabled={disabled} style={{ ...s, fontFamily: F.disp, fontWeight: 600, fontSize: small ? 12.5 : 14, padding: small ? "8px 13px" : "12px 18px", borderRadius: 8, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9 }}>{children}</button>;
}
function Spinner({ label }) { return <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.slate, fontSize: 14 }}><span style={{ width: 14, height: 14, border: `2px solid ${T.line}`, borderTopColor: T.emerald, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />{label}</div>; }
const Label = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, letterSpacing: 0.4, textTransform: "uppercase" }}>{children}</div>;
const Eyebrow = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>{children}</div>;
const Back = ({ onClick }) => <button onClick={onClick} aria-label="Go back" style={{ fontFamily: F.mono, fontSize: 12, color: T.slate, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 8 }}>← back</button>;
const Hint = ({ show, children }) => show ? <div role="status" style={{ marginTop: 8, fontSize: 12.5, color: T.slate }}>{children}</div> : null;
const Card = ({ children, accent, pad }) => <div style={{ background: T.surface, border: `1px solid ${accent || T.line}`, borderRadius: 12, padding: pad ?? 22 }}>{children}</div>;
const Li = ({ children }) => <li style={{ display: "flex", gap: 9 }}><span style={{ color: T.emerald }}>.</span><span style={{ color: T.slate }}>{children}</span></li>;
function Field({ label, value, onChange, placeholder, rows }) {
  const common = { width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 };
  return <div style={{ marginBottom: 14 }}><Label>{label}</Label>{rows ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...common, resize: "vertical" }} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={common} />}</div>;
}
const Centered = ({ children }) => <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>{children}</div>;
const Scroll = ({ children }) => <div style={{ height: "100%", overflowY: "auto", padding: "26px 24px" }}>{children}</div>;

// ---- toasts (shell chrome; any screen can push one via useToast) ----
const ToastCtx = createContext(() => {});
const useToast = () => useContext(ToastCtx);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);
  return <ToastCtx.Provider value={push}>
    {children}
    <div className="ftoasts" aria-live="polite">{toasts.map(t => <div key={t.id} className="ftoast" role="status">{t.msg}</div>)}</div>
  </ToastCtx.Provider>;
}

// ============================================================
// LANDING
// ============================================================
function Landing({ go }) {
  return <Centered><div style={{ width: "100%", maxWidth: 760 }} className="rise">
    <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 38, letterSpacing: 4 }}>FUMANA</div>
    <p style={{ color: T.slate, fontSize: 16, marginTop: 8, maxWidth: 560 }}>The talent clearing house for African engineering. One network: builders prove their worth on one side, enterprises hire it on the other, and the impact is settled in the open.</p>
    <div className="doors" style={{ marginTop: 26 }}>
      <Card accent={T.line}>
        <Label>I am a builder</Label>
        <h3 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 20, margin: "8px 0 6px" }}>Build a profile employers trust</h3>
        <p style={{ color: T.slate, fontSize: 14, marginBottom: 14 }}>Sign in, take the AI interview, and join the network with your identity shielded until you choose to reveal it.</p>
        <Btn onClick={() => go("candidate")}>Enter as a builder</Btn>
      </Card>
      <Card accent={T.line}>
        <Label>I am an employer</Label>
        <h3 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 20, margin: "8px 0 6px" }}>Hire verified talent</h3>
        <p style={{ color: T.slate, fontSize: 14, marginBottom: 14 }}>Search by evidence, see bias-shielded matches, sign an SOW with liability carried for you, and see where every dollar goes.</p>
        <Btn onClick={() => go("employer")}>Enter as an employer</Btn>
      </Card>
    </div>
    <div style={{ marginTop: 18, fontFamily: F.mono, fontSize: 12, color: T.slate }}>Tip: build a profile first, then enter as an employer and search. You will find yourself in the results.</div>
    <div style={{ marginTop: 22, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Powered by Telos. Designed by Lexington Advisory Group.</div>
  </div></Centered>;
}

// ============================================================
// CANDIDATE SIDE
// ============================================================
// ---- Applications and Hub (candidate). NO MODEL. Reads the shared store ----
// On Fumana, employers come to the builder (bias-shielded search). This hub
// reads the shared builders store (your own network entry) and the shared
// employer pipeline (who has engaged you) and shows the engagement stage as the
// application status. Matches = engaged at any stage; invites = interviewing or
// beyond; offers = SOW.
const APP_STAGE = {
  shortlisted: { label: "Matched", color: T.emerald, note: "An employer shortlisted your profile. Your identity stays shielded until you accept an interview." },
  interviewing: { label: "Interview invite", color: T.brass, note: "An employer has invited you to interview." },
  sow: { label: "Offer", color: T.emerald, note: "An employer is preparing an offer and Statement of Work." },
};
const APP_STAGES = ["shortlisted", "interviewing", "sow"];

function Applications({ builders, pipeline }) {
  const me = builders.find(b => b.isYou);
  const engagements = me
    ? APP_STAGES.flatMap(stage => pipeline[stage].filter(x => x.handle === me.handle).map(entry => ({ stage, entry })))
    : [];
  const matches = engagements.length;
  const invites = engagements.filter(e => e.stage === "interviewing" || e.stage === "sow").length;
  const offers = engagements.filter(e => e.stage === "sow").length;
  const Stat = ({ n, label }) => <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px" }}>
    <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 26, color: T.emerald, lineHeight: 1 }}>{n}</div>
    <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, marginTop: 4 }}>{label}</div>
  </div>;
  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <Eyebrow>Applications and Hub</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Where you stand</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>On Fumana, employers come to you. These are the roles matched to your profile and where each one stands. Your identity stays shielded until you accept an interview.</p>

    {!me && <Card><p style={{ color: T.slate, fontSize: 14 }}>You are not in the network yet. Complete your assessment to join, get matched by employers, and track every engagement here.</p></Card>}

    {me && <>
      <Card accent={T.emerald}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <Label>Your profile in the network</Label>
            <div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 18, marginTop: 6 }}>{me.handle} <span style={{ color: T.slate, fontWeight: 400, fontSize: 14 }}>. {me.role}</span></div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, marginTop: 4 }}>identity shielded until you accept an interview</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 30, color: T.emerald, lineHeight: 1 }}>{me.profileStrength}</div>
            <div><span style={{ display: "inline-block", marginTop: 6, fontFamily: F.mono, fontSize: 11, color: T.onAccent, background: me.tier.color, borderRadius: 5, padding: "3px 10px" }}>{me.tier.name} tier</span></div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
        <Stat n={matches} label="matches" /><Stat n={invites} label="interview invites" /><Stat n={offers} label="offers" />
      </div>

      <div style={{ marginTop: 18 }}>
        <Label>Your applications</Label>
        {engagements.length === 0
          ? <div style={{ marginTop: 10 }}><Card><p style={{ color: T.slate, fontSize: 14 }}>No employer engagements yet. Employers search the network by evidence. When one shortlists you, it appears here with its status.</p></Card></div>
          : <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
            {engagements.map((e, i) => { const s = APP_STAGE[e.stage]; return <Card key={i} accent={s.color}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{e.entry.role}</div>
                  <div style={{ fontSize: 13.5, color: T.slate, marginTop: 4 }}>{s.note}</div>
                  {e.entry.monthlyUsd ? <div style={{ fontFamily: F.mono, fontSize: 12, color: T.slate, marginTop: 6 }}>{usd(e.entry.monthlyUsd)} / month</div> : null}
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: T.onAccent, background: s.color, borderRadius: 5, padding: "4px 10px", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
            </Card>; })}
          </div>}
      </div>
    </>}
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ---- Wallet and Escrow (candidate). NO MODEL. All display and computed ----
// Figures are computed in code from the builder's SOW-stage engagement in the
// shared pipeline (illustrative). Real payments, escrow release, and payouts run
// on the backend. Payout methods are placeholders.
const PAYOUT_METHODS = [
  { id: "mpesa", name: "M-Pesa", note: "Mobile money, East Africa" },
  { id: "paystack", name: "Paystack", note: "Cards and bank transfer, Nigeria and beyond" },
  { id: "flutterwave", name: "Flutterwave", note: "Pan-African payouts" },
];
const WALLET_PLATFORM_PCT = 12, WALLET_STATUTORY_PCT = 18; // illustrative, matches the finance hub

function Wallet({ builders, pipeline }) {
  const me = builders.find(b => b.isYou);
  const toast = useToast();
  const [method, setMethod] = useState("mpesa");
  const methodName = PAYOUT_METHODS.find(m => m.id === method).name;
  // Computed from the shared store: a SOW-stage engagement is the paying contract.
  const contract = me ? pipeline.sow.find(x => x.handle === me.handle) : null;
  const monthly = contract?.monthlyUsd || 0;
  const net = Math.round(monthly * (1 - (WALLET_PLATFORM_PCT + WALLET_STATUTORY_PCT) / 100));
  const escrow = monthly ? net : 0;
  const available = monthly ? net : 0;
  const history = monthly ? [{ label: "Previous cycle", amt: net }, { label: "Two cycles ago", amt: net }] : [];
  const lifetime = available + escrow + history.reduce((a, h) => a + h.amt, 0);

  if (!me) return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <Eyebrow>Wallet and Escrow</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 8px" }}>Your wallet</h2>
    <Card><p style={{ color: T.slate, fontSize: 14 }}>You are not in the network yet. Complete your assessment to join and start earning through Fumana.</p></Card>
  </div></Scroll>;

  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <Eyebrow>Wallet and Escrow</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Your earnings, held and paid safely</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 14 }}>Fumana holds each cycle in escrow and releases it to your chosen payout method. Figures are computed from your engagement.</p>
    <div style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F.mono, fontSize: 12, color: T.slate, border: `1px solid ${T.line}`, borderRadius: 6, padding: "6px 11px" }}>Illustrative. Real payments, escrow release, and payouts run on the backend.</div>

    <div className="row2">
      <Card><Label>Available balance</Label>
        <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 34, color: T.emerald, margin: "8px 0 10px" }}>{usd(available)}</div>
        <Btn small disabled={available <= 0} onClick={() => toast("Withdrawals run on the backend. This prototype is display only.")}>Withdraw to {methodName}</Btn>
      </Card>
      <Card accent={T.brass}><Label>In escrow</Label>
        <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 34, color: T.brass, margin: "8px 0 10px" }}>{usd(escrow)}</div>
        <div style={{ fontSize: 13, color: T.slate }}>Held for the current cycle, released on milestone completion.</div>
      </Card>
    </div>

    <div style={{ marginTop: 12, fontFamily: F.mono, fontSize: 12, color: T.slate }}>Lifetime earned {usd(lifetime)}{monthly ? ` . from a ${usd(monthly)}/month engagement, ${usd(net)} net per cycle after a disclosed ${WALLET_PLATFORM_PCT}% platform fee and ${WALLET_STATUTORY_PCT}% illustrative statutory remittance` : " . no active contract yet"}</div>

    <div style={{ marginTop: 18 }}>
      <Label>Payout method</Label>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {PAYOUT_METHODS.map(m => <button key={m.id} type="button" onClick={() => setMethod(m.id)} aria-pressed={method === m.id}
          style={{ textAlign: "left", cursor: "pointer", background: T.surface, border: `1px solid ${method === m.id ? T.emerald : T.line}`, borderLeftWidth: 4, borderLeftColor: method === m.id ? T.emerald : T.line, borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span><span style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 15 }}>{m.name}</span><span style={{ display: "block", color: T.slate, fontSize: 12.5, marginTop: 2 }}>{m.note}</span></span>
          <span aria-hidden="true" style={{ width: 18, height: 18, flexShrink: 0, borderRadius: "50%", border: `1px solid ${method === m.id ? T.emerald : T.line}`, background: method === m.id ? T.emerald : "transparent" }} />
        </button>)}
      </div>
      <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Placeholder. Connecting a real payout account is a backend step.</div>
    </div>

    <div style={{ marginTop: 18 }}>
      <Label>Payout history</Label>
      {history.length === 0
        ? <div style={{ marginTop: 10 }}><Card><p style={{ color: T.slate, fontSize: 14 }}>No payouts yet. Once you accept an offer, released cycles show here.</p></Card></div>
        : <div style={{ marginTop: 10, display: "grid", gap: 1, background: T.line, border: `1px solid ${T.line}`, borderRadius: 8, overflow: "hidden" }}>
          {history.map((hst, i) => <div key={i} style={{ background: T.surface, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 14 }}>{hst.label}</div><div style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald }}>Paid to {methodName}</div></div>
            <div style={{ fontFamily: F.mono, fontSize: 15 }}>{usd(hst.amt)}</div>
          </div>)}
        </div>}
    </div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ---- Community Ecosystem (candidate). NO MODEL. Computed counters ----
// Squads are a seeded list you can join; peer activity is read from the shared
// builders store; the impact portfolio and Good Citizen Points are computed
// counters with disclosed formulas (illustrative, real accounting is backend).
const SQUADS = [
  { id: "backend", name: "Backend Guild", focus: "Distributed systems, data, and reliability", members: 128 },
  { id: "frontend", name: "Frontend Collective", focus: "Accessible, resilient interfaces on real networks", members: 96 },
  { id: "data", name: "Data Engineering Circle", focus: "Pipelines, quality, and analytics across markets", members: 71 },
  { id: "lagos", name: "Lagos Builders", focus: "Local meetups, mentorship, and referrals", members: 154 },
];

function Community({ builders, pipeline }) {
  const me = builders.find(b => b.isYou);
  const [joined, setJoined] = useState([]);

  if (!me) return <Scroll><div style={{ maxWidth: 900, margin: "0 auto" }} className="rise">
    <Eyebrow>Community Ecosystem</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 8px" }}>Grow with the network</h2>
    <Card><p style={{ color: T.slate, fontSize: 14 }}>You are not in the network yet. Complete your assessment to join squads and start building your impact portfolio.</p></Card>
  </div></Scroll>;

  const engagements = ["shortlisted", "interviewing", "sow"].reduce((n, st) => n + (pipeline[st].some(x => x.handle === me.handle) ? 1 : 0), 0);
  const contract = pipeline.sow.find(x => x.handle === me.handle);
  const netMonthly = contract ? Math.round(contract.monthlyUsd * 0.70) : 0;
  const localImpact = Math.round(netMonthly * 12 * 0.62); // illustrative annual local value retained
  const gcp = me.profileStrength + joined.length * 40;
  const peers = builders.filter(b => !b.isYou);
  const activity = p => (p.profileStrength >= 85 ? "reached Top 1% tier" : p.profileStrength >= 70 ? "reached Gold tier" : "joined the network");
  const Stat = ({ n, label }) => <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px" }}>
    <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 24, color: T.emerald, lineHeight: 1 }}>{n}</div>
    <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, marginTop: 4 }}>{label}</div>
  </div>;

  return <Scroll><div style={{ maxWidth: 900, margin: "0 auto" }} className="rise">
    <Eyebrow>Community Ecosystem</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Grow with the network</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Join squads, see what peers are building, and track the impact you create.</p>

    <Label>Your impact portfolio</Label>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 10 }}>
      <Stat n={gcp} label="Good Citizen Points" /><Stat n={engagements} label="engagements" /><Stat n={usd(localImpact)} label="local impact / yr, illustrative" /><Stat n={joined.length} label="squads joined" />
    </div>
    <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 11.5, color: T.slate }}>Good Citizen Points = profile strength {me.profileStrength} + 40 per squad joined. Impact figures are computed and illustrative; real impact accounting runs on the backend.</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>{["SDG 8", "SDG 9", "SDG 17"].map(s => <span key={s} style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald, border: `1px solid ${T.line}`, borderRadius: 4, padding: "2px 8px" }}>{s}</span>)}</div>

    <div style={{ marginTop: 22 }}>
      <Label>Fumana Squads</Label>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
        {SQUADS.map(sq => { const on = joined.includes(sq.id); return <Card key={sq.id} accent={on ? T.emerald : T.line}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div><div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 16 }}>{sq.name}</div><div style={{ color: T.slate, fontSize: 13, marginTop: 3 }}>{sq.focus}</div><div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, marginTop: 5 }}>{sq.members + (on ? 1 : 0)} members</div></div>
            <Btn small kind={on ? "ghost" : "primary"} onClick={() => setJoined(j => on ? j.filter(x => x !== sq.id) : [...j, sq.id])}>{on ? "Joined" : "Join squad"}</Btn>
          </div>
        </Card>; })}
      </div>
    </div>

    <div style={{ marginTop: 22 }}>
      <Label>Peer activity</Label>
      {peers.length === 0
        ? <div style={{ marginTop: 10 }}><Card><p style={{ color: T.slate, fontSize: 14 }}>No peers in the network yet.</p></Card></div>
        : <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {peers.map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 10, padding: "11px 14px" }}>
            <div style={{ fontSize: 14 }}><b>{p.handle}</b> <span style={{ color: T.slate }}>. {p.role} {activity(p)}</span></div>
            {p.tier && <span style={{ fontFamily: F.mono, fontSize: 10.5, color: T.onAccent, background: p.tier.color, borderRadius: 5, padding: "3px 9px", whiteSpace: "nowrap" }}>{p.tier.name}</span>}
          </div>)}
        </div>}
    </div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ---- Settings and Comm (candidate). NO MODEL ----
// Language, notification-channel toggles, a two-factor placeholder, and the data
// vault. Export is a real client-side JSON download of what the app holds about
// you; delete is the flagged entry point to the Phase 4 data-rights flow.
const LANGUAGES = ["English", "Francais", "Kiswahili", "Yoruba", "Hausa", "Amharic", "Portugues", "Arabic"];
const CHANNELS = [{ id: "whatsapp", name: "WhatsApp" }, { id: "sms", name: "SMS" }, { id: "email", name: "Email" }];

const Toggle = ({ on, onClick, label }) => <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick}
  style={{ width: 44, height: 24, borderRadius: 12, border: `1px solid ${on ? T.emerald : T.line}`, background: on ? T.emerald : T.mute, position: "relative", cursor: "pointer", padding: 0, flexShrink: 0 }}>
  <span aria-hidden="true" style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
</button>;

function Settings({ builders }) {
  const me = builders.find(b => b.isYou);
  const toast = useToast();
  const [lang, setLang] = useState("English");
  const [channels, setChannels] = useState({ whatsapp: true, sms: false, email: true });
  const [twoFA, setTwoFA] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function exportData() {
    const data = { profile: me || null, preferences: { language: lang, notifications: channels, twoFactor: twoFA }, note: "Illustrative export of the data Fumana holds about you. Real exports are assembled on the backend." };
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const a = document.createElement("a"); a.href = url; a.download = "fumana-my-data.json"; a.click();
      URL.revokeObjectURL(url);
      toast("Your data export downloaded.");
    } catch { toast("Data export runs on the backend in production."); }
  }

  const row = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "11px 0", borderTop: `1px solid ${T.mute}` };
  const ctrl = { marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14 };

  return <Scroll><div style={{ maxWidth: 760, margin: "0 auto" }} className="rise">
    <Eyebrow>Settings and Comm</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Settings and communication</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Your language, how we reach you, security, and the data Fumana holds about you.</p>

    <Card><Label>Language</Label>
      <select value={lang} onChange={e => setLang(e.target.value)} style={{ ...ctrl, width: "100%" }}>{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
      <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Applied across the app on the backend.</div>
    </Card>
    <div style={{ height: 14 }} />

    <Card><Label>Notification channels</Label>
      <div style={{ marginTop: 6 }}>{CHANNELS.map(ch => <div key={ch.id} style={row}>
        <span style={{ fontSize: 14 }}>{ch.name}</span>
        <Toggle on={channels[ch.id]} label={ch.name} onClick={() => setChannels(c => ({ ...c, [ch.id]: !c[ch.id] }))} />
      </div>)}</div>
      <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Delivery runs on the backend.</div>
    </Card>
    <div style={{ height: 14 }} />

    <Card><Label>Security</Label>
      <div style={row}><div><div style={{ fontSize: 14 }}>Two-factor authentication</div><div style={{ color: T.slate, fontSize: 12.5, marginTop: 2 }}>Placeholder. Real 2FA enrolment is a backend step.</div></div>
        <Toggle on={twoFA} label="Two-factor authentication" onClick={() => { setTwoFA(v => !v); toast("Two-factor setup runs on the backend."); }} /></div>
    </Card>
    <div style={{ height: 14 }} />

    <Card accent={T.brass}><Label>Your data vault</Label>
      <p style={{ fontSize: 14, color: T.slate, margin: "8px 0 14px" }}>See, export, or delete the data Fumana holds about you. You own it.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn small onClick={exportData}>Export my data</Btn>
        {!confirmDelete && !deleted && <Btn small kind="ghost" onClick={() => setConfirmDelete(true)}>Delete my data</Btn>}
      </div>
      {confirmDelete && !deleted && <div style={{ marginTop: 14, background: T.paper, border: `1px solid ${T.alert}`, borderRadius: 8, padding: 14 }}>
        <div style={{ fontSize: 14, marginBottom: 10 }}>This requests removal of your profile and data from the network. This cannot be undone.</div>
        <div style={{ display: "flex", gap: 10 }}><Btn small kind="ghost" onClick={() => { setConfirmDelete(false); setDeleted(true); }}>Confirm delete</Btn><Btn small kind="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Btn></div>
      </div>}
      {deleted && <div style={{ marginTop: 14, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 8, padding: 14, fontSize: 13.5, color: T.slate }}>Deletion requested. A reviewer will confirm and your profile is withdrawn from the network. Stubbed queue in this prototype.</div>}
      <div style={{ marginTop: 12, fontFamily: F.mono, fontSize: 11, color: T.slate }}>This is the entry point to your data rights. Contest, human review, and the full data-rights flow arrive in the trust and safety phase.</div>
    </Card>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// Candidate Carbon nav. Growth Dashboard and Upskill are real; the rest are
// honest stubs to be built in Phase 1+.
const CAND_NAV = [
  ["dashboard", "Growth Dashboard"], ["applications", "Applications and Hub"], ["wallet", "Wallet and Escrow"],
  ["community", "Community Ecosystem"], ["alchemist", "Experience Alchemist"], ["upskill", "Upskill and Training"],
  ["settings", "Settings and Comm"],
];
function CandidateApp({ addBuilder, builders, pipeline, exit }) {
  const [screen, setScreen] = useState("signin");
  const [profile, setProfile] = useState({ name: "", role: "", city: "", experience: "" });
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(0);
  const [published, setPublished] = useState(false);
  const toast = useToast();
  const inApp = CAND_NAV.some(([k]) => k === screen);

  function finish(r) {
    setResult(r); setPoints(120);
    const handle = "FB-" + Math.floor(1000 + Math.random() * 8999);
    const top = [...r.dimensions].sort((a, b) => b.score - a.score).slice(0, 3).map(d => d.name);
    const summary = `${profile.role || "Engineer"} with a ${r.tier.name} profile. Strongest in ${top.slice(0, 2).join(" and ")}. ${profile.experience.split(".")[0]}.`;
    addBuilder({ handle, role: profile.role || "Engineer", summary, skills: top, profileStrength: r.profileStrength, tier: r.tier, dimensions: r.dimensions, isYou: true });
    setPublished(true); setScreen("dashboard");
    toast("You are in the network. Your profile is live to employers, identity shielded.");
  }

  return <Shell role="candidate" exit={exit} nav={inApp ? CAND_NAV : null} active={screen} onNav={setScreen} showZuri={!NO_DOCK_SCREENS.includes(screen)}>
    {screen === "signin" && <SignIn onNext={() => setScreen("consent")} who="builder" />}
    {screen === "consent" && <Consent onNext={() => setScreen("onboarding")} onBack={() => setScreen("signin")} />}
    {screen === "onboarding" && <Onboarding profile={profile} setProfile={setProfile} onNext={() => setScreen("assessinfo")} onBack={() => setScreen("consent")} />}
    {screen === "assessinfo" && <AssessInfo onOptIn={() => setScreen("interview")} onOptOut={() => setScreen("humanreview")} onBack={() => setScreen("onboarding")} />}
    {screen === "humanreview" && <HumanReview onSwitch={() => setScreen("interview")} />}
    {screen === "interview" && <Interview profile={profile} onBack={() => setScreen("assessinfo")} onComplete={finish} />}
    {screen === "dashboard" && result && <Dashboard profile={profile} result={result} onUpskill={() => setScreen("upskill")} published={published} />}
    {screen === "upskill" && result && <Upskill result={result} points={points} setPoints={setPoints} />}
    {screen === "applications" && <Applications builders={builders} pipeline={pipeline} />}
    {screen === "wallet" && <Wallet builders={builders} pipeline={pipeline} />}
    {screen === "community" && <Community builders={builders} pipeline={pipeline} />}
    {screen === "alchemist" && <Stub eyebrow="Candidate" title="Experience Alchemist" line="Turn your raw experience into recruiter-ready outcomes, with save and copy." />}
    {screen === "settings" && <Settings builders={builders} />}
  </Shell>;
}

function SignIn({ onNext, who }) {
  return <Centered><div style={{ width: "100%", maxWidth: 420 }} className="rise">
    <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 28, letterSpacing: 3 }}>FUMANA</div>
    <div style={{ color: T.slate, marginTop: 6, fontSize: 15 }}>{who === "builder" ? "Build a profile employers can trust on sight." : "Engage verified African talent with the risk carried for you."}</div>
    <div style={{ marginTop: 24, display: "grid", gap: 10 }}>
      <Btn kind="sso" full onClick={onNext}>Continue with Google{who === "builder" ? "" : " Workspace"}</Btn>
      <Btn kind="sso" full onClick={onNext}>Continue with Microsoft{who === "builder" ? "" : " Entra ID"}</Btn>
      {who === "builder" && <><div style={{ display: "flex", alignItems: "center", gap: 12, color: T.slate, fontSize: 12, margin: "6px 0" }}><span style={{ flex: 1, height: 1, background: T.line }} />or<span style={{ flex: 1, height: 1, background: T.line }} /></div><Btn full onClick={onNext}>Sign up with email</Btn></>}
    </div>
    <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 11, color: T.slate, lineHeight: 1.6 }}>SSO is wired at the UI layer for this prototype. Real OIDC and SAML are a backend step.</div>
  </div></Centered>;
}

function Consent({ onNext, onBack }) {
  const [ok, setOk] = useState(false);
  return <Centered><div style={{ width: "100%", maxWidth: 480 }} className="rise">
    <Back onClick={onBack} /><Eyebrow>Step 1 of 4 . Your protection</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 24, margin: "8px 0 6px" }}>How Fumana protects you</h2>
    <Card pad={20}><ul style={{ listStyle: "none", display: "grid", gap: 12, fontSize: 14 }}>
      <Li><b>Bias shield.</b> Your name, photo, location, and gender stay hidden from employers until you accept an interview.</Li>
      <Li><b>You own your data.</b> Export or delete your profile at any time.</Li>
      <Li><b>Honest assessment.</b> Zuri scores your strengths and names your gaps plainly, then helps you close them.</Li>
    </ul>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontSize: 14, cursor: "pointer" }}><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} style={{ marginTop: 3 }} /><span>I understand the bias-shielded process and data terms.</span></label>
    </Card>
    <div style={{ marginTop: 16 }}><Btn full disabled={!ok} onClick={onNext}>Continue</Btn><Hint show={!ok}>Tick the box above to continue.</Hint></div>
  </div></Centered>;
}

// ---- Async elevator pitch recorder (candidate). NO MODEL ----
// Browser MediaRecorder capture of camera + mic, a 60s countdown that auto-stops,
// retake, and a playback preview. Recording is in-browser; upload and storage
// are a backend step. (The interview uses pre-rendered clips, so there is no
// live capture to reuse; this is built directly on MediaRecorder.)
function PitchRecorder() {
  const [phase, setPhase] = useState("idle"); // idle | recording | recorded | error
  const [remaining, setRemaining] = useState(60);
  const [error, setError] = useState("");
  const liveRef = useRef(null);
  const previewRef = useRef(null);
  const m = useRef({ stream: null, recorder: null, chunks: [], url: null, timer: null, left: 60 });

  const stopTracks = () => { if (m.current.stream) { m.current.stream.getTracks().forEach(t => t.stop()); m.current.stream = null; } };
  function stop() {
    if (m.current.timer) { clearInterval(m.current.timer); m.current.timer = null; }
    if (m.current.recorder && m.current.recorder.state !== "inactive") { try { m.current.recorder.stop(); } catch { /* already stopped */ } }
  }

  useEffect(() => () => { stop(); stopTracks(); if (m.current.url) URL.revokeObjectURL(m.current.url); }, []);
  useEffect(() => { if (phase === "recorded" && previewRef.current && m.current.url) previewRef.current.src = m.current.url; }, [phase]);

  async function start() {
    setError("");
    if (m.current.url) { URL.revokeObjectURL(m.current.url); m.current.url = null; }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Your browser does not support in-browser recording. Try a recent Chrome, Edge, or Firefox.");
      setPhase("error"); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      m.current.stream = stream;
      if (liveRef.current) { liveRef.current.srcObject = stream; liveRef.current.play?.().catch(() => {}); }
      const rec = new MediaRecorder(stream);
      m.current.recorder = rec; m.current.chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) m.current.chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(m.current.chunks, { type: m.current.chunks[0]?.type || "video/webm" });
        m.current.url = URL.createObjectURL(blob);
        stopTracks();
        setPhase("recorded");
      };
      rec.start();
      m.current.left = 60; setRemaining(60); setPhase("recording");
      m.current.timer = setInterval(() => {
        m.current.left -= 1; setRemaining(m.current.left);
        if (m.current.left <= 0) stop();
      }, 1000);
    } catch {
      setError("Camera and microphone access is needed to record. Check your browser permissions and try again.");
      stopTracks(); setPhase("error");
    }
  }

  function retake() {
    if (m.current.url) { URL.revokeObjectURL(m.current.url); m.current.url = null; }
    setRemaining(60); setPhase("idle");
  }

  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  const frame = { position: "relative", width: "100%", aspectRatio: "16 / 9", background: T.ink, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}` };
  const vid = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

  return <div>
    <Label>60-second elevator pitch</Label>
    <p style={{ color: T.slate, fontSize: 13.5, margin: "6px 0 12px" }}>Optional. Record a short intro in your own words. Strong profiles usually include one.</p>
    <div style={frame}>
      {phase === "recorded"
        ? <video ref={previewRef} controls playsInline style={vid} />
        : <video ref={liveRef} muted playsInline autoPlay style={{ ...vid, opacity: phase === "recording" ? 1 : 0.85 }} />}
      {phase === "idle" && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9FB0BC", fontSize: 13, fontFamily: F.mono, textAlign: "center", padding: 16 }}>Your camera preview appears here when you start</div>}
      {phase === "recording" && <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 7, background: "rgba(12,26,38,0.72)", color: "#fff", borderRadius: 20, padding: "5px 11px", fontFamily: F.mono, fontSize: 12 }}><span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: T.alert }} />{clock}</div>}
    </div>
    <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {phase === "idle" && <Btn small onClick={start}>Start recording</Btn>}
      {phase === "recording" && <><Btn small kind="ghost" onClick={stop}>Stop</Btn><span style={{ fontFamily: F.mono, fontSize: 12, color: T.slate }}>Recording. Auto-stops at 0:00.</span></>}
      {phase === "recorded" && <><Btn small kind="ghost" onClick={retake}>Retake</Btn><span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>Pitch ready.</span></>}
      {phase === "error" && <Btn small onClick={start}>Try again</Btn>}
    </div>
    {error && <div role="alert" style={{ marginTop: 10, color: T.alert, fontSize: 13 }}>{error}</div>}
    <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Recording happens in your browser. Upload and storage are a backend step.</div>
  </div>;
}

function Onboarding({ profile, setProfile, onNext, onBack }) {
  const [fileName, setFileName] = useState("");
  function readFile(e) { const f = e.target.files?.[0]; if (!f) return; setFileName(f.name); if (/\.(txt|md)$/i.test(f.name)) { const r = new FileReader(); r.onload = () => setProfile(p => ({ ...p, experience: (p.experience ? p.experience + "\n" : "") + r.result })); r.readAsText(f); } }
  const ready = profile.role && profile.experience.trim().length > 30;
  return <Scroll><div style={{ maxWidth: 640, margin: "0 auto" }} className="rise">
    <Back onClick={onBack} /><Eyebrow>Step 2 of 4 . Profile</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 4px" }}>Tell us who you are</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Write how you actually talk. Zuri turns it into recruiter-ready outcomes later. Upload a CV if you have one.</p>
    <Card>
      <Field label="Full name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Stays hidden from employers until interview" />
      <div className="row2"><Field label="Role" value={profile.role} onChange={v => setProfile(p => ({ ...p, role: v }))} placeholder="Backend engineer" /><Field label="City" value={profile.city} onChange={v => setProfile(p => ({ ...p, city: v }))} placeholder="Lagos, Nigeria" /></div>
      <Field label="Your experience, in your words" rows={6} value={profile.experience} onChange={v => setProfile(p => ({ ...p, experience: v }))} placeholder="What have you built, what did you handle, what went wrong and how did you fix it." />
      <div style={{ border: `1px dashed ${T.line}`, borderRadius: 10, padding: 16, textAlign: "center", background: T.paper }}><label style={{ cursor: "pointer", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, color: T.slate, fontSize: 13 }}><span style={{ fontFamily: F.mono, color: T.emerald }}>upload CV</span><span>{fileName || "txt or md reads in now. PDF and docx parse on the backend."}</span><input type="file" accept=".txt,.md,.pdf,.docx" onChange={readFile} style={{ display: "none" }} /></label></div>
    </Card>
    <div style={{ height: 14 }} />
    <Card><PitchRecorder /></Card>
    <div style={{ marginTop: 16, marginBottom: 30 }}><Btn full disabled={!ready} onClick={onNext}>Continue</Btn><Hint show={!ready}>Add your role and a few sentences of experience to continue.</Hint></div>
  </div></Scroll>;
}

function AssessInfo({ onOptIn, onOptOut, onBack }) {
  const [ok, setOk] = useState(false);
  return <Scroll><div style={{ maxWidth: 680, margin: "0 auto" }} className="rise">
    <Back onClick={onBack} /><Eyebrow>Step 3 of 4 . How you are assessed</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 4px" }}>How Zuri assesses you, and your choice</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Before anything runs, here is exactly how this works and what your options are. You are in control.</p>
    <Card><Label>What is measured, and from what</Label><div style={{ display: "grid", gap: 9, marginTop: 12 }}>
      {DIMENSIONS.map(d => <div key={d} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5, borderTop: `1px solid ${T.mute}`, paddingTop: 9 }}><div><span style={{ fontWeight: 600 }}>{d}</span><div style={{ color: T.slate, fontSize: 12.5 }}>{EVIDENCE[d]}</div></div><span style={{ fontFamily: F.mono, fontSize: 12, color: T.slate, whiteSpace: "nowrap" }}>weight {WEIGHTS[d].toFixed(2)}</span></div>)}
    </div></Card>
    <div style={{ height: 14 }} />
    <Card><Label>The method</Label><ul style={{ listStyle: "none", display: "grid", gap: 9, marginTop: 12, fontSize: 14 }}>
      <Li>Zuri, an AI interviewer, asks questions that adapt to your answers.</Li>
      <Li>An AI model reads your experience and answers, then scores each dimension 0 to 100 with a written reason you will see.</Li>
      <Li>Your Profile Strength is a weighted average computed by the fixed formula above.</Li>
      <Li>Scores are a starting point, not a verdict. You can retake the interview.</Li>
    </ul></Card>
    <div style={{ height: 14 }} />
    <Card accent={T.brass}><Label>Your rights</Label><ul style={{ listStyle: "none", display: "grid", gap: 9, marginTop: 12, fontSize: 14 }}>
      <Li>You can decline AI assessment and request a human reviewer instead.</Li>
      <Li>You can see why every score was given.</Li>
      <Li>You can delete your assessment and data at any time.</Li>
    </ul>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 14, cursor: "pointer" }}><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} style={{ marginTop: 3 }} /><span>I understand how I will be assessed and I consent to the AI interview.</span></label>
    </Card>
    <div style={{ marginTop: 16, marginBottom: 12, display: "flex", gap: 10, flexWrap: "wrap" }}><Btn disabled={!ok} onClick={onOptIn}>Start the AI interview</Btn><Btn kind="ghost" onClick={onOptOut}>Request human review instead</Btn></div>
    <Hint show={!ok}>Consent above to start the AI interview, or choose human review, which needs no consent.</Hint>
    <div style={{ height: 24 }} />
  </div></Scroll>;
}

const HumanReview = ({ onSwitch }) => <Centered><div style={{ maxWidth: 460 }} className="rise">
  <Eyebrow>Human review requested</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 24, margin: "8px 0 8px" }}>A person will assess you</h2>
  <Card><p style={{ fontSize: 14, color: T.slate, lineHeight: 1.6 }}>You declined AI assessment, which is your right. A human reviewer will complete your evaluation and your profile opens once they finish. In this prototype the human-review queue is stubbed, so no score is produced here.</p><div style={{ marginTop: 14 }}><Btn kind="ghost" small onClick={onSwitch}>Change my mind, use the AI interview</Btn></div></Card>
</div></Centered>;

// ---- Zuri voice: real TTS from the backend, SpeechSynthesis as fallback ----
// Level 1 voice: audio only, no lip-sync. `speaking` is true while audio plays.
// Used by the copilot dock (the interview uses pre-rendered video clips whose
// voice is baked in). If /api/tts fails (no key, provider down), the browser
// speaks the same line with SpeechSynthesis so Zuri is never silent.
function useZuriVoice() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);
  const urlRef = useRef(null);

  const cleanupAudio = () => {
    if (audioRef.current) { audioRef.current.onended = null; audioRef.current.onerror = null; audioRef.current.pause(); audioRef.current = null; }
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
  };
  const stop = useCallback(() => {
    cleanupAudio();
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);
  const fallback = useCallback((text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, []);
  const speak = useCallback(async (text) => {
    const line = (text || "").trim();
    if (!line) return;
    stop();
    setSpeaking(true);
    let handled = false;
    const goFallback = () => { if (handled) return; handled = true; cleanupAudio(); fallback(line); };
    try {
      const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: line }) });
      if (!res.ok) throw new Error("tts " + res.status);
      const buf = await res.arrayBuffer();
      if (!buf.byteLength) throw new Error("empty audio");
      const url = URL.createObjectURL(new Blob([buf], { type: res.headers.get("Content-Type") || "audio/mpeg" }));
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { handled = true; cleanupAudio(); setSpeaking(false); };
      audio.onerror = goFallback;
      await audio.play();
    } catch {
      goFallback();
    }
  }, [stop, fallback]);

  useEffect(() => stop, [stop]);
  return { speaking, speak, stop };
}

// Scripted interview clips. Zuri delivers the intro and each question as a
// pre-rendered video; her voice is in the clip, so no TTS here. Each `text` is
// the exact spoken line — it drives the on-screen caption (accessibility) and
// the scoring transcript.
const INTERVIEW_INTRO = { id: "intro", video: introVideo, text: "Hi, I'm Zuri. I'll ask you five questions. Take your time, answer each in your own words, and speak the way you naturally would." };
const INTERVIEW_SCRIPT = [
  { id: "q1", video: q1Video, text: "Tell me about a time you had to explain something technical to someone who did not share your background. How did you make sure they understood?" },
  { id: "q2", video: q2Video, text: "Tell me about a time you disagreed with a manager or a client about how something should be done. What did you do?" },
  { id: "q3", video: q3Video, text: "Walk me through how you keep a teammate in another country unblocked when you are offline for several hours." },
  { id: "q4", video: q4Video, text: "Tell me about a time you were given a task without clear instructions. How did you decide what to build?" },
  { id: "q5", video: q5Video, text: "Describe the hardest technical problem you have solved. How did you find the root cause, and what did you change?" },
];

// Zuri on camera, with a soft pulsing ring around the frame while the clip
// plays (the speaking cue at Level 1 — no lip-sync). A click precedes every
// clip, so autoplay with audio is allowed; controls cover any blocked autoplay.
function VideoStage({ src, autoPlay, playing, onPlay, onStop }) {
  const ref = useRef(null);
  useEffect(() => { if (autoPlay && ref.current) ref.current.play?.().catch(() => {}); }, [autoPlay, src]);
  return <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
    <video ref={ref} src={src} playsInline controls preload="metadata" aria-label="Zuri speaking"
      onPlay={onPlay} onPlaying={onPlay} onEnded={onStop} onPause={onStop}
      style={{ width: "100%", borderRadius: 16, display: "block", background: T.ink, border: `1px solid ${T.line}` }} />
    {playing && <span aria-hidden="true" style={{ position: "absolute", inset: -3, borderRadius: 18, pointerEvents: "none", animation: "zuriPulse 1.6s ease-in-out infinite" }} />}
  </div>;
}

function Interview({ profile, onBack, onComplete }) {
  // Scripted video interview: an intro clip, then five question clips. Zuri's
  // voice is in each clip; the candidate answers each in turn. Scoring runs on
  // the collected transcript, unchanged.
  const [phase, setPhase] = useState("ready"); // ready | intro | qa | scoring
  const [idx, setIdx] = useState(0);
  const [qa, setQa] = useState([]);
  const [answer, setAnswer] = useState("");
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState(false);
  const total = INTERVIEW_SCRIPT.length;
  const captionFor = i => INTERVIEW_SCRIPT[i].text || `Interview question ${i + 1}`;
  const last = idx + 1 >= total;

  function submit() {
    if (answer.trim().length < 4) return;
    const nextQa = [...qa, { q: captionFor(idx), a: answer.trim() }];
    setQa(nextQa); setAnswer(""); setPlaying(false);
    if (last) { score(nextQa); return; }
    setIdx(idx + 1);
  }
  async function score(finalQa) {
    setPhase("scoring"); setErr(false);
    try {
      const transcript = finalQa.map((x, i) => `Q${i + 1}: ${x.q}\nA${i + 1}: ${x.a}`).join("\n\n");
      const sys = "You are the Fumana scoring model, powered by Telos. Using the builder's experience and interview transcript, score six dimensions for global remote enterprise work: " + DIMENSIONS.join(", ") + ". Technical depth draws on experience and technical answers. The others draw on the interview, not the resume alone. Score each 0 to 100 with a fair, specific one-sentence rationale grounded in what they said. Be honest, name real gaps. Return ONLY JSON, no fences. Shape: {\"dimensions\":[{\"name\":string,\"score\":number,\"rationale\":string}]}. Use exactly those six names.";
      const out = await callClaude({ system: sys, messages: [{ role: "user", content: `Experience:\n${profile.experience}\n\nInterview:\n${transcript}` }], expectJson: true });
      const dims = out.dimensions || []; const cs = composite(dims);
      onComplete({ dimensions: dims, profileStrength: cs, tier: tierOf(cs), weakest: [...dims].sort((a, b) => a.score - b.score)[0] });
    } catch { setErr(true); }
  }

  const answered = qa.length > 0 && <div style={{ marginTop: 24, display: "grid", gap: 8, width: "100%", maxWidth: 560 }}>
    {qa.map((x, i) => <div key={i} style={{ fontSize: 13.5, color: T.slate }}><b style={{ color: T.emerald, fontFamily: F.mono, fontSize: 11 }}>Q{i + 1}</b> {x.a}</div>)}
  </div>;

  return <Scroll><div style={{ maxWidth: 680, margin: "0 auto" }} className="rise">
    <Back onClick={onBack} />
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <Eyebrow>Step 4 of 4 . Interview with Zuri</Eyebrow>
      <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>A short conversation, not a form</h2>
      <p style={{ color: T.slate, fontSize: 15, maxWidth: 520, margin: "0 auto" }}>Zuri asks {total} questions on camera. Watch each one, then answer in your own words.</p>
    </div>

    {phase === "ready" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p style={{ color: T.slate, fontSize: 14 }}>Zuri will introduce herself, then ask her first question.</p>
      <Btn onClick={() => { setPhase("intro"); }}>Begin interview with Zuri</Btn>
    </div>}

    {phase === "intro" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <VideoStage key="intro" src={INTERVIEW_INTRO.video} autoPlay playing={playing} onPlay={() => setPlaying(true)} onStop={() => setPlaying(false)} />
      <Btn onClick={() => { setPlaying(false); setPhase("qa"); }}>Start the questions</Btn>
    </div>}

    {phase === "qa" && <div style={{ display: "grid", gap: 14, justifyItems: "center" }}>
      <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate }}>question {idx + 1} of {total}</div>
      <VideoStage key={INTERVIEW_SCRIPT[idx].id} src={INTERVIEW_SCRIPT[idx].video} autoPlay playing={playing} onPlay={() => setPlaying(true)} onStop={() => setPlaying(false)} />
      {INTERVIEW_SCRIPT[idx].text && <div style={{ maxWidth: 520, textAlign: "center", fontSize: 15 }}><b style={{ color: T.emerald, fontFamily: F.mono, fontSize: 12 }}>ZURI</b> . {INTERVIEW_SCRIPT[idx].text}</div>}
      <div style={{ width: "100%", maxWidth: 560 }}>
        <textarea rows={3} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Answer in a few honest sentences." style={{ width: "100%", background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, resize: "vertical" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}><Btn small disabled={answer.trim().length < 4} onClick={submit}>{last ? "Finish and score" : "Send answer"}</Btn></div>
      </div>
      {answered}
    </div>}

    {phase === "scoring" && <div style={{ display: "flex", justifyContent: "center" }}>{err
      ? <div style={{ color: T.alert, fontSize: 14, display: "flex", gap: 12, alignItems: "center" }}>Scoring did not complete. <Btn kind="ghost" small onClick={() => score(qa)}>Try again</Btn></div>
      : <Card><Spinner label="Zuri is scoring your six dimensions..." /></Card>}</div>}

    <div style={{ height: 30 }} />
  </div></Scroll>;
}

function Dashboard({ profile, result, onUpskill, published }) {
  const tier = result.tier; const rec = MODULES[result.weakest?.name] || MODULES["Technical depth"];
  const [zuri, setZuri] = useState(""); const [zb, setZb] = useState(false); const [showCalc, setShowCalc] = useState(false);
  async function askZuri() { setZb(true); try { const sys = "You are Zuri, the career copilot inside Fumana. In three to four warm, direct sentences, tell this builder the single most valuable next move to raise their tier, grounded in their weakest dimension. No hype, no em dashes."; setZuri(await callClaude({ system: sys, messages: [{ role: "user", content: `Profile strength ${result.profileStrength}, tier ${tier.name}. Weakest: ${result.weakest?.name} at ${result.weakest?.score}. Role ${profile.role || "engineer"}.` }], expectJson: false })); } catch { setZuri("Zuri is unavailable right now."); } setZb(false); }
  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    {published && <div style={{ marginBottom: 16, background: "rgba(6,110,90,0.06)", border: `1px solid ${T.emerald}`, borderRadius: 10, padding: "11px 14px", fontSize: 13.5, color: T.vault }}>✓ You are now in the network, identity shielded. Switch to the employer side and search to find yourself.</div>}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
      <div><Eyebrow>Growth dashboard</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 2px" }}>{profile.name || "Your"} profile</h2><div style={{ color: T.slate, fontSize: 14 }}>{profile.role} . {profile.city || "location hidden"}</div></div>
      <div style={{ textAlign: "right" }}><div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 46, color: T.emerald, lineHeight: 1 }}>{result.profileStrength}</div><button onClick={() => setShowCalc(s => !s)} style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>profile strength . how is this calculated</button><div><span style={{ display: "inline-block", marginTop: 6, fontFamily: F.mono, fontSize: 12, color: T.onAccent, background: tier.color, borderRadius: 5, padding: "3px 10px" }}>{tier.name} tier</span></div></div>
    </div>
    {showCalc && <div style={{ marginTop: 14 }}><Card pad={16} accent={T.brass}><Label>How this was calculated</Label><p style={{ fontSize: 13.5, color: T.slate, margin: "8px 0 10px" }}>Each dimension is scored 0 to 100 by an AI model from your experience and interview. Profile Strength is their weighted average.</p><div style={{ display: "grid", gap: 5 }}>{result.dimensions.map((d, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 12, color: T.slate }}><span>{d.name}</span><span>{d.score} × {WEIGHTS[d.name]?.toFixed(2)}</span></div>)}<div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 12.5, color: T.emerald, borderTop: `1px solid ${T.mute}`, paddingTop: 6, marginTop: 2 }}><span>weighted average</span><span>{result.profileStrength}</span></div></div></Card></div>}
    <div className="dash" style={{ marginTop: 18 }}>
      <Card><Label>Dimension scores</Label><div style={{ display: "grid", gap: 14, marginTop: 14 }}>{result.dimensions.map((d, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: T.ink, fontWeight: 500 }}>{d.name}</span><span style={{ fontFamily: F.mono, color: d.score < 60 ? T.alert : T.ink }}>{d.score}/100</span></div><div style={{ height: 7, background: T.mute, borderRadius: 4, marginTop: 5 }}><div style={{ height: "100%", width: `${d.score}%`, background: d.score < 60 ? T.alert : T.emerald, borderRadius: 4, animation: "grow 1s ease" }} /></div><div style={{ fontSize: 12, color: T.slate, marginTop: 4 }}>{d.rationale}</div></div>)}</div></Card>
      <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
        <Card accent={T.brass}><Label>Recommended next step</Label><div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{rec.title}</div><p style={{ fontSize: 13.5, color: T.slate, margin: "6px 0 12px" }}>{rec.blurb}</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>+{rec.pts} pts</span><Btn small onClick={onUpskill}>Start module</Btn></div><div style={{ marginTop: 10, fontSize: 12, color: T.slate }}>Weakest dimension: <b>{result.weakest?.name}</b>.</div></Card>
        <Card accent={zuri ? T.emerald : T.line}><Label>Zuri . career copilot</Label>{!zuri && !zb && <div style={{ marginTop: 10 }}><Btn kind="ghost" small onClick={askZuri}>Ask Zuri what to do next</Btn></div>}{zb && <div style={{ marginTop: 12 }}><Spinner label="Zuri is thinking..." /></div>}{zuri && <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>{zuri}</p>}</Card>
      </div>
    </div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

function Upskill({ result, points, setPoints }) {
  const recId = (MODULES[result.weakest?.name] || {}).id; const list = Object.values(MODULES); const [done, setDone] = useState({});
  const complete = m => { if (done[m.id]) return; setDone(d => ({ ...d, [m.id]: true })); setPoints(p => p + m.pts); };
  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}><div><Eyebrow>Upskilling journey</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 0" }}>Close the gap, earn the tier</h2></div><div style={{ textAlign: "right" }}><div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 30, color: T.brass, lineHeight: 1 }}>{points}</div><div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate }}>reward points</div></div></div>
    <div className="mods" style={{ marginTop: 20 }}>{list.map(m => { const isRec = m.id === recId, finished = done[m.id]; return <Card key={m.id} accent={isRec ? T.brass : T.line}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Label>{isRec ? "recommended for you" : "module"}</Label>{finished && <span style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald }}>completed</span>}</div><div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{m.title}</div><p style={{ fontSize: 13.5, color: T.slate, margin: "6px 0 14px" }}>{m.blurb}</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>+{m.pts} pts</span><Btn kind={finished ? "ghost" : "primary"} small disabled={finished} onClick={() => complete(m)}>{finished ? "Done" : "Complete module"}</Btn></div></Card>; })}</div>
    <div style={{ marginTop: 18 }}><Card><Label>Achievements</Label><div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}><Badge on label="Profile verified" /><Badge on={result.profileStrength >= 50} label="Silver reached" /><Badge on={result.profileStrength >= 70} label="Gold reached" /><Badge on={Object.keys(done).length >= 1} label="First module" /><Badge on={points >= 500} label="500 points" /></div></Card></div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}
const Badge = ({ on, label }) => <span style={{ fontFamily: F.mono, fontSize: 12, padding: "6px 11px", borderRadius: 6, border: `1px solid ${on ? T.emerald : T.line}`, color: on ? T.emerald : T.slate, background: on ? "rgba(6,110,90,0.06)" : "transparent" }}>{on ? "✓ " : "○ "}{label}</span>;

// ============================================================
// EMPLOYER SIDE
// ============================================================
// ---- Employer onboarding (welcome -> auth -> company-info -> alignment -> app) ----
// Same shell, palette, and components as the candidate portal. Auth reuses
// <SignIn who="employer">. The Zuri dock is gated off until the app (showZuri).

// Employer sidebar/nav. Dashboard is real; Engage Experts, Talent Pipeline, and
// Investments reuse the existing working screens; the rest are honest stubs.
const EMP_NAV = [
  ["dashboard", "Dashboard"], ["engage", "Engage Experts"], ["pipeline", "Talent Pipeline"],
  ["saved", "Saved Builders"], ["team", "My Team"], ["trust", "Trust and Safety"],
  ["investments", "Investments"], ["account", "Account"],
];
const EMP_SIZES = ["1 to 50", "51 to 200", "201 to 1000", "1000 plus"];
const EMP_PLEDGES = [
  { key: "fairPay", title: "Fair pay", desc: "I will pay within a fair band for the role and region, not below local market for equivalent skill." },
  { key: "hours", title: "Reasonable hours", desc: "I will agree a working-hours and timezone-overlap expectation, not round-the-clock availability." },
  { key: "noMonitor", title: "No covert monitoring", desc: "I will not covertly monitor or surveil the builder. Any work tracking is agreed and visible to them." },
];

function EmpWelcome({ onNext }) {
  return <Centered><div style={{ width: "100%", maxWidth: 620 }} className="rise">
    <Eyebrow>For employers</Eyebrow>
    <h1 style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 34, letterSpacing: 0.3, lineHeight: 1.12, margin: "8px 0 10px" }}>Hire verified African talent with the risk carried for you</h1>
    <p style={{ color: T.slate, fontSize: 16, maxWidth: 520, marginBottom: 26 }}>Search by evidence, not keywords, with identity shielded until you commit.</p>
    <Btn onClick={onNext}>Get started</Btn>
  </div></Centered>;
}

function EmpCompanyInfo({ company, setCompany, onNext, onBack }) {
  const set = (k, v) => setCompany(c => ({ ...c, [k]: v }));
  const ready = company.name.trim() && company.domain.trim() && company.industry.trim();
  const ctrl = { width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 };
  return <Scroll><div style={{ maxWidth: 640, margin: "0 auto" }} className="rise">
    <Back onClick={onBack} /><Eyebrow>Step 1 of 2 . Your organization</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 4px" }}>Tell us about your company</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>This creates your employer profile. We verify your organization from your work email domain.</p>
    <Card>
      <Field label="Company name" value={company.name} onChange={v => set("name", v)} placeholder="Acme GmbH" />
      <div style={{ marginBottom: 14 }}>
        <Label>Work email domain</Label>
        <input value={company.domain} onChange={e => set("domain", e.target.value)} placeholder="acme.com" style={ctrl} />
        <div style={{ fontSize: 12, color: T.slate, marginTop: 6 }}>Used to verify your organization.</div>
      </div>
      <div className="row2">
        <Field label="Industry" value={company.industry} onChange={v => set("industry", v)} placeholder="Fintech" />
        <div style={{ marginBottom: 14 }}><Label>Company size</Label>
          <select value={company.size} onChange={e => set("size", e.target.value)} style={ctrl}>
            <option value="">Select...</option>{EMP_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <Field label="Headquarters country" value={company.country} onChange={v => set("country", v)} placeholder="Germany" />
      <Field label="What is the team hiring for?" rows={4} value={company.hiringFor} onChange={v => set("hiringFor", v)} placeholder="Optional. A short description of the roles or work." />
    </Card>
    <div style={{ marginTop: 16, marginBottom: 30 }}><Btn full disabled={!ready} onClick={onNext}>Continue</Btn><Hint show={!ready}>Company name, work email domain, and industry are required to continue.</Hint></div>
  </div></Scroll>;
}

function EmpAlignment({ onEnter, onBack }) {
  const [on, setOn] = useState({});
  const all = EMP_PLEDGES.every(p => on[p.key]);
  return <Scroll><div style={{ maxWidth: 680, margin: "0 auto" }} className="rise">
    <Back onClick={onBack} /><Eyebrow>Step 2 of 2 . Fair terms</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 6px" }}>The terms you sign to hire here</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Fumana matches you with shielded builders. In return, you commit to fair terms. These protect the builder and keep the network trusted.</p>
    <div style={{ display: "grid", gap: 12 }}>
      {EMP_PLEDGES.map(p => <button key={p.key} type="button" aria-pressed={!!on[p.key]} onClick={() => setOn(o => ({ ...o, [p.key]: !o[p.key] }))}
        style={{ textAlign: "left", cursor: "pointer", background: T.surface, border: `1px solid ${on[p.key] ? T.emerald : T.line}`, borderLeftWidth: 4, borderLeftColor: on[p.key] ? T.emerald : T.line, borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span aria-hidden="true" style={{ marginTop: 1, width: 20, height: 20, flexShrink: 0, borderRadius: 5, border: `1px solid ${on[p.key] ? T.emerald : T.line}`, background: on[p.key] ? T.emerald : "transparent", color: T.onAccent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{on[p.key] ? "✓" : ""}</span>
        <span><span style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 16 }}>{p.title}</span><div style={{ color: T.slate, fontSize: 13.5, marginTop: 3 }}>{p.desc}</div></span>
      </button>)}
    </div>
    <div style={{ marginTop: 18, fontSize: 14 }}>I agree to these terms as a condition of using Fumana.</div>
    <div style={{ marginTop: 14, marginBottom: 30 }}><Btn full disabled={!all} onClick={onEnter}>Enter Fumana</Btn><Hint show={!all}>Accept all three commitments to continue.</Hint></div>
  </div></Scroll>;
}

function EmpDashboard({ company, onEngage }) {
  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <Eyebrow>Dashboard</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>{company.name || "Your company"}</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Welcome to Fumana. Your organization is set up. Engage verified, bias-shielded talent whenever you are ready.</p>
    <Card><Label>Get started</Label><div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 18, margin: "8px 0 6px" }}>Engage experts</div><p style={{ fontSize: 13.5, color: T.slate, marginBottom: 14 }}>Describe the work and search the network by evidence, not keywords.</p><Btn onClick={onEngage}>Engage Experts</Btn></Card>
  </div></Scroll>;
}

// Shared stub screen for nav items not yet built.
const Stub = ({ eyebrow, title, line }) => <Scroll><div style={{ maxWidth: 760, margin: "0 auto" }} className="rise">
  <Eyebrow>{eyebrow}</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 8px" }}>{title}</h2>
  <Card><p style={{ color: T.slate, fontSize: 14 }}>{line}</p><div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Coming next.</div></Card>
</div></Scroll>;

function EmployerApp({ builders, pipeline, setPipeline, exit }) {
  const [screen, setScreen] = useState("welcome");
  const [tab, setTab] = useState("dashboard");
  const [company, setCompany] = useState({ name: "", domain: "", industry: "", size: "", country: "", hiringFor: "" });
  const [active, setActive] = useState(null); const [sow, setSow] = useState(null);
  const toast = useToast();
  const inApp = screen === "app";
  const shortlist = c => {
    if (pipeline.shortlisted.concat(pipeline.interviewing, pipeline.sow).some(x => x.handle === c.handle)) return;
    setPipeline(p => ({ ...p, shortlisted: [...p.shortlisted, c] }));
    toast(`${c.handle} added to your pipeline.`);
  };
  const move = (c, from, to) => setPipeline(p => ({ ...p, [from]: p[from].filter(x => x.handle !== c.handle), [to]: [...p[to], c] }));
  const openSow = c => { setActive(c); setSow(null); setTab("compliance"); };
  // Reveal-and-interview gate: committing to an interview moves the builder into
  // the shared pipeline's interviewing stage, which is what unlocks role + summary.
  const requestInterview = c => {
    if (pipeline.interviewing.concat(pipeline.sow).some(x => x.handle === c.handle)) return;
    setPipeline(p => ({ ...p, shortlisted: p.shortlisted.filter(x => x.handle !== c.handle), interviewing: [...p.interviewing, c] }));
    toast(`Interview requested with ${c.handle}. Identity revealed for the interview.`);
  };
  // Saved Builders store: the employer's private bookmarks from search.
  const [saved, setSaved] = useState([]);
  const toggleSave = c => setSaved(s => s.some(x => x.handle === c.handle) ? s.filter(x => x.handle !== c.handle) : [...s, c]);
  return <Shell role="employer" exit={exit} nav={inApp ? EMP_NAV : null} active={tab} onNav={setTab} showZuri={inApp}>
    {screen === "welcome" && <EmpWelcome onNext={() => setScreen("auth")} />}
    {screen === "auth" && <SignIn onNext={() => setScreen("company-info")} who="employer" />}
    {screen === "company-info" && <EmpCompanyInfo company={company} setCompany={setCompany} onNext={() => setScreen("alignment")} onBack={() => setScreen("auth")} />}
    {screen === "alignment" && <EmpAlignment onEnter={() => { setScreen("app"); setTab("dashboard"); }} onBack={() => setScreen("company-info")} />}
    {inApp && tab === "dashboard" && <EmpDashboard company={company} onEngage={() => setTab("engage")} />}
    {inApp && tab === "engage" && <Search builders={builders} pipeline={pipeline} onShortlist={shortlist} onRequestInterview={requestInterview} saved={saved} onToggleSave={toggleSave} />}
    {inApp && tab === "pipeline" && <Pipeline pipeline={pipeline} move={move} openSow={openSow} />}
    {inApp && tab === "compliance" && <Compliance active={active} sow={sow} setSow={setSow} />}
    {inApp && tab === "investments" && <Finance pipeline={pipeline} />}
    {inApp && tab === "saved" && <SavedBuilders saved={saved} pipeline={pipeline} onToggleSave={toggleSave} />}
    {inApp && tab === "team" && <MyTeam pipeline={pipeline} />}
    {inApp && tab === "trust" && <Stub eyebrow="Employer" title="Trust and Safety" line="Your fair-terms commitments, reporting, and dispute resolution." />}
    {inApp && tab === "account" && <Account company={company} setCompany={setCompany} />}
  </Shell>;
}

// ---- Saved Builders (employer). NO MODEL. Bookmarks from search ----
function SavedBuilders({ saved, pipeline, onToggleSave }) {
  const revealed = h => pipeline.interviewing.concat(pipeline.sow).some(x => x.handle === h);
  return <Scroll><div style={{ maxWidth: 900, margin: "0 auto" }} className="rise">
    <Eyebrow>Saved Builders</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Builders you saved</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Bookmarked from search. Still identity-shielded until you request an interview.</p>
    {saved.length === 0
      ? <Card><p style={{ color: T.slate, fontSize: 14 }}>No saved builders yet. Use Save on a search result to bookmark builders here.</p></Card>
      : <div style={{ display: "grid", gap: 14 }}>{saved.map((c, i) => { const isRev = revealed(c.handle); return <Card key={i} accent={isRev ? T.emerald : T.line}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div><div style={{ fontWeight: 600 }}>{c.handle}{isRev && <span style={{ color: T.slate, fontWeight: 400, fontSize: 13 }}> . {c.role}</span>}</div><div style={{ fontFamily: F.mono, fontSize: 11, color: isRev ? T.emerald : T.slate }}>{isRev ? "identity revealed for interview" : "identity shielded"}</div></div>
          {typeof c.fit === "number" && <div style={{ textAlign: "right" }}><div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 22, color: T.emerald, lineHeight: 1 }}>{c.fit}%</div><div style={{ fontFamily: F.mono, fontSize: 10, color: T.slate }}>fit . computed</div></div>}
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "12px 0 10px" }}>{(c.skills || []).map((s, j) => <span key={j} style={{ fontFamily: F.mono, fontSize: 11.5, color: T.emerald, border: `1px solid ${T.line}`, borderRadius: 4, padding: "3px 8px" }}>{s}</span>)}</div>
        {isRev && c.summary && <p style={{ fontSize: 14, color: T.ink, marginBottom: 12 }}>{c.summary}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn kind="ghost" small onClick={() => onToggleSave(c)}>Remove</Btn></div>
      </Card>; })}</div>}
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ---- My Team (employer). NO MODEL. Active SOW engagements, cost computed ----
function MyTeam({ pipeline }) {
  const team = pipeline.sow;
  const total = team.reduce((s, c) => s + (c.monthlyUsd || 0), 0);
  return <Scroll><div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
    <Eyebrow>My Team</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Your active engagements</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Builders at SOW stage. Monthly cost is computed from the agreed budget.</p>
    {team.length === 0
      ? <Card><p style={{ color: T.slate, fontSize: 14 }}>No active engagements yet. Move a candidate to SOW pending to build your team.</p></Card>
      : <Card>
        <div style={{ display: "grid", gap: 1, background: T.line, border: `1px solid ${T.line}`, borderRadius: 8, overflow: "hidden" }}>
          {team.map((c, i) => <div key={i} style={{ background: T.surface, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.handle}</div><div style={{ color: T.slate, fontSize: 12.5 }}>{c.role}</div></div>
            <div style={{ fontFamily: F.mono, fontSize: 15 }}>{usd(c.monthlyUsd || 0)}<span style={{ color: T.slate, fontSize: 11 }}> / mo</span></div>
          </div>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: F.mono, fontSize: 13 }}><span style={{ color: T.slate }}>total monthly, computed</span><span style={{ color: T.emerald, fontWeight: 600 }}>{usd(total)}</span></div>
      </Card>}
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ---- Account (employer). NO MODEL. Editable company profile ----
function Account({ company, setCompany }) {
  const toast = useToast();
  const [draft, setDraft] = useState(company);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const dirty = ["name", "domain", "industry", "size", "country"].some(k => (draft[k] || "") !== (company[k] || ""));
  const ctrl = { width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14 };
  return <Scroll><div style={{ maxWidth: 640, margin: "0 auto" }} className="rise">
    <Eyebrow>Account</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Company account</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Your organization profile. Editable here; persistence and verification are backend steps.</p>
    <Card>
      <Field label="Company name" value={draft.name} onChange={v => set("name", v)} placeholder="Acme GmbH" />
      <Field label="Work email domain" value={draft.domain} onChange={v => set("domain", v)} placeholder="acme.com" />
      <div className="row2">
        <Field label="Industry" value={draft.industry} onChange={v => set("industry", v)} placeholder="Fintech" />
        <div style={{ marginBottom: 14 }}><Label>Company size</Label><select value={draft.size || ""} onChange={e => set("size", e.target.value)} style={ctrl}><option value="">Select...</option>{EMP_SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <Field label="Headquarters country" value={draft.country} onChange={v => set("country", v)} placeholder="Germany" />
    </Card>
    <div style={{ marginTop: 16 }}><Btn disabled={!dirty} onClick={() => { setCompany(draft); toast("Account saved. Persistence is a backend step."); }}>Save changes</Btn></div>
    <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 11, color: T.slate }}>Company profile, billing, and verification run on the backend.</div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// One bias-shielded result card. Locked shows fit + handle + skills (evidence);
// role and summary are revealed only once the employer has requested an interview.
// No name, photo, or location is ever rendered (the network entry has none).
function SearchCard({ c, isRevealed, isShort, isIn, isSaved, budget, onShortlist, onRequestInterview, onToggleSave }) {
  return <Card accent={isRevealed ? T.emerald : T.line}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 10, background: T.mute, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontSize: 11, color: T.slate }}>FU</div>
        <div><div style={{ fontWeight: 600 }}>{c.handle}{isRevealed && <span style={{ color: T.slate, fontWeight: 400, fontSize: 13 }}> . {c.role}</span>}{c.isYou && <span style={{ marginLeft: 8, fontFamily: F.mono, fontSize: 10, color: T.emerald, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "1px 6px" }}>new to network</span>}</div><div style={{ fontFamily: F.mono, fontSize: 11, color: isRevealed ? T.emerald : T.slate }}>{isRevealed ? "identity revealed for interview" : "identity shielded"}</div></div>
      </div>
      <div style={{ textAlign: "right" }}><div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 24, color: T.emerald, lineHeight: 1 }}>{c.fit}%</div><div style={{ fontFamily: F.mono, fontSize: 10, color: T.slate }}>fit . computed</div></div>
    </div>
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "12px 0 10px" }}>{(c.skills || []).map((s, j) => <span key={j} style={{ fontFamily: F.mono, fontSize: 11.5, color: T.emerald, border: `1px solid ${T.line}`, borderRadius: 4, padding: "3px 8px" }}>{s}</span>)}</div>
    {isRevealed
      ? <p style={{ fontSize: 14, color: T.ink, marginBottom: 12 }}>{c.summary}</p>
      : <div style={{ border: `1px dashed ${T.line}`, borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 13, color: T.slate, background: T.paper }}>Role and summary are shielded. Request an interview to reveal them and commit to this builder.</div>}
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
      <Btn kind="ghost" small onClick={() => onToggleSave(c)}>{isSaved ? "Saved" : "Save"}</Btn>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {!isRevealed && <Btn kind="ghost" small disabled={isIn} onClick={() => onShortlist({ ...c, monthlyUsd: Number(budget) })}>{isShort ? "Shortlisted" : "Shortlist"}</Btn>}
        {isRevealed
          ? <span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald, alignSelf: "center" }}>Interview requested</span>
          : <Btn small onClick={() => onRequestInterview({ ...c, monthlyUsd: Number(budget) })}>Request interview</Btn>}
      </div>
    </div>
  </Card>;
}

function Search({ builders, pipeline, onShortlist, onRequestInterview, saved, onToggleSave }) {
  const [need, setNeed] = useState("Backend engineer for a payments reconciliation service, fintech, Berlin team, async across time zones.");
  const [budget, setBudget] = useState("4500");
  const [ranked, setRanked] = useState(null); const [busy, setBusy] = useState(false);
  const ready = need.trim().length > 20 && Number(budget) > 0;
  // Fit is computed from the shared store: profile strength plus role/skill hits
  // against the described need. No model.
  function run() {
    setBusy(true);
    const words = need.toLowerCase();
    const scored = builders.map(b => {
      const roleHit = words.includes((b.role || "").toLowerCase().split(" ")[0]) ? 18 : 0;
      const skillHit = (b.skills || []).reduce((a, s) => a + (words.includes(s.toLowerCase()) ? 6 : 0), 0);
      const fit = Math.min(99, Math.round((b.profileStrength || 70) * 0.8 + roleHit + skillHit));
      return { ...b, fit };
    }).sort((a, b) => b.fit - a.fit);
    setTimeout(() => { setRanked(scored); setBusy(false); }, 350);
  }
  // Reveal state IS the shared pipeline: role + summary unlock only once the
  // employer has committed to an interview (interviewing or beyond).
  const revealed = h => pipeline.interviewing.concat(pipeline.sow).some(x => x.handle === h);
  const inPipeline = h => pipeline.shortlisted.concat(pipeline.interviewing, pipeline.sow).some(x => x.handle === h);
  const shortlisted = h => pipeline.shortlisted.some(x => x.handle === h);
  return <Scroll><div style={{ maxWidth: 900, margin: "0 auto" }} className="rise">
    <Eyebrow>Engage Experts</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Engage experts by evidence, not keywords</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Describe the work and the budget. Matches are bias-shielded: no name, photo, or location. Role and summary stay hidden until you commit to an interview.</p>
    <Card><Label>What you need</Label>
      <textarea rows={3} value={need} onChange={e => setNeed(e.target.value)} style={{ width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, resize: "vertical" }} />
      <div className="row2" style={{ marginTop: 12, alignItems: "end" }}>
        <div><Label>Monthly budget, USD</Label><input value={budget} onChange={e => setBudget(e.target.value.replace(/[^0-9]/g, ""))} style={{ width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14 }} /></div>
        <div>{busy ? <Spinner label="Matching against the network..." /> : <Btn full disabled={!ready} onClick={run}>Search the network</Btn>}<Hint show={!ready && !busy}>Describe the work and set a budget above zero.</Hint></div>
      </div>
    </Card>
    {ranked && <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
      {ranked.length === 0 && <Card><p style={{ color: T.slate, fontSize: 14 }}>No builders in the network yet. Build a candidate profile first, then search.</p></Card>}
      {ranked.map((c, i) => <SearchCard key={i} c={c} isRevealed={revealed(c.handle)} isShort={shortlisted(c.handle)} isIn={inPipeline(c.handle)} isSaved={saved.some(x => x.handle === c.handle)} budget={budget} onShortlist={onShortlist} onRequestInterview={onRequestInterview} onToggleSave={onToggleSave} />)}
    </div>}
  </div></Scroll>;
}

const COLS = [["shortlisted", "Shortlisted"], ["interviewing", "Interviewing"], ["sow", "SOW pending"]];
function Pipeline({ pipeline, move, openSow }) {
  const empty = COLS.every(([k]) => pipeline[k].length === 0);
  return <Scroll><div style={{ maxWidth: 980, margin: "0 auto" }} className="rise">
    <Eyebrow>Talent Pipeline</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Move candidates toward a signed SOW</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Shortlisted builders stay identity-shielded. Moving one to Interviewing reveals their role, the same reveal-and-interview gate as search.</p>
    {empty && <Card><p style={{ color: T.slate, fontSize: 14 }}>Your pipeline is empty. Search the network, then shortlist or request an interview to begin.</p></Card>}
    {!empty && <div className="kanban">{COLS.map(([key, title], ci) => {
      const shielded = key === "shortlisted";
      return <div key={key} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><Label>{title}</Label><span style={{ fontFamily: F.mono, fontSize: 11, color: T.slate }}>{pipeline[key].length}</span></div>
        <div style={{ display: "grid", gap: 10 }}>
          {pipeline[key].map((c, i) => <Card key={i} pad={14}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.handle}</div>{typeof c.fit === "number" && <span style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald }}>{c.fit}%</span>}</div>
            <div style={{ fontSize: 12.5, marginTop: 3, marginBottom: 8, color: T.slate }}>{shielded ? <span style={{ fontFamily: F.mono, fontSize: 11 }}>identity shielded</span> : c.role}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ci > 0 && <Btn kind="ghost" small onClick={() => move(c, key, COLS[ci - 1][0])}>← {COLS[ci - 1][1]}</Btn>}
              {ci < 2 && <Btn small onClick={() => move(c, key, COLS[ci + 1][0])}>{COLS[ci + 1][1]} →</Btn>}
              {key === "sow" && <Btn small onClick={() => openSow(c)}>Generate SOW</Btn>}
            </div>
          </Card>)}
          {pipeline[key].length === 0 && <div style={{ color: T.slate, fontSize: 12.5, padding: "6px 2px" }}>Empty</div>}
        </div>
      </div>;
    })}</div>}
  </div></Scroll>;
}

function Compliance({ active, sow, setSow }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(false);
  if (!active) return <Scroll><div style={{ maxWidth: 760, margin: "0 auto" }} className="rise"><Card><p style={{ color: T.slate, fontSize: 14 }}>Move a candidate to SOW pending and select Generate SOW to open the compliance hub.</p></Card></div></Scroll>;
  async function gen() { setBusy(true); setErr(false); try { const sys = "You are the Fumana procurement engine acting as Employer of Record. Draft a concise Statement of Work for an enterprise client engaging a vetted builder through Fumana. Fumana is the legal EOR and handles IP assignment and local tax remittance. Return ONLY JSON, no fences. Shape: {\"title\":string,\"scope\":[string],\"deliverables\":[string],\"ip_clause\":string,\"eor_note\":string,\"term\":string}. Keep each line tight. No em dashes. Do not assert specific tax rates."; const out = await callClaude({ system: sys, messages: [{ role: "user", content: `Builder: ${active.handle}, ${active.role}. Monthly USD ${active.monthlyUsd}. Context: ${active.summary}` }], expectJson: true }); setSow(out); } catch (e) { setErr(true); } setBusy(false); }
  return <Scroll><div style={{ maxWidth: 820, margin: "0 auto" }} className="rise">
    <Eyebrow>Legal and compliance hub</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Statement of Work for {active.handle}</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 14 }}>Fumana signs as Employer of Record and assumes local employment liability, tax remittance, and IP assignment.</p>
    <div style={{ marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F.mono, fontSize: 12, color: T.emerald, border: `1px solid ${T.emerald}`, borderRadius: 6, padding: "5px 11px" }}>✓ liability assumed</div>
    {!sow && <div>{busy ? <Spinner label="Compliance agent is drafting the SOW..." /> : <Btn onClick={gen}>Generate localized SOW</Btn>}{err && <div style={{ marginTop: 12, color: T.alert, fontSize: 14, display: "flex", gap: 12, alignItems: "center" }}>Draft did not complete. <Btn kind="ghost" small onClick={gen}>Run again</Btn></div>}</div>}
    {sow && <Card accent={T.brass}><div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 18 }}>{sow.title}</div><SowList label="Scope" items={sow.scope} /><SowList label="Deliverables" items={sow.deliverables} /><Mini label="IP assignment" body={sow.ip_clause} /><Mini label="Employer of Record" body={sow.eor_note} /><Mini label="Term" body={sow.term} /><div style={{ marginTop: 14 }}><Btn kind="ghost" small onClick={() => setSow(null)}>Redraft</Btn></div></Card>}
  </div></Scroll>;
}
const SowList = ({ label, items }) => <div style={{ marginTop: 12 }}><div style={{ color: T.emerald, fontSize: 12, fontFamily: F.mono, marginBottom: 6 }}>{label}</div><div style={{ display: "grid", gap: 6 }}>{(items || []).map((it, i) => <div key={i} style={{ fontSize: 14, display: "flex", gap: 8 }}><span style={{ color: T.brass }}>.</span><span>{it}</span></div>)}</div></div>;
const Mini = ({ label, body }) => <div style={{ marginTop: 10, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11 }}><span style={{ color: T.brass, fontSize: 12, fontWeight: 600 }}>{label}. </span><span style={{ color: T.slate, fontSize: 13 }}>{body}</span></div>;

// Investments and fee waterfall (employer). NO MODEL — every figure is computed
// in code from the SOW contract budget, every assumption labelled. (Zuri the
// marketplace economist is a NEEDS MODEL feature and arrives in Phase 2.)
function Finance({ pipeline }) {
  const [statutoryPct, setStatutoryPct] = useState(18);
  const platformPct = 12; // Fumana platform fee, disclosed
  const team = pipeline.sow;
  if (team.length === 0) return <Scroll><div style={{ maxWidth: 760, margin: "0 auto" }} className="rise">
    <Eyebrow>Investments</Eyebrow><h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 8px" }}>Where every dollar goes</h2>
    <Card><p style={{ color: T.slate, fontSize: 14 }}>No active engagements yet. Move a candidate to SOW pending to see the cost breakdown and impact.</p></Card>
  </div></Scroll>;

  const rows = team.map(c => {
    const monthly = c.monthlyUsd || 0;
    const platform = Math.round(monthly * platformPct / 100);
    const statutory = Math.round(monthly * statutoryPct / 100);
    return { c, monthly, platform, statutory, net: monthly - platform - statutory };
  });
  const sum = k => rows.reduce((s, r) => s + r[k], 0);
  const totalMonthly = sum("monthly"), totalNet = sum("net");
  const localRetained = Math.round(totalNet * 12 * 0.62); // illustrative annual local value retained
  const domestic = Math.round(totalMonthly * 2.4);        // illustrative domestic equivalent
  const saving = domestic - totalMonthly;

  return <Scroll><div style={{ maxWidth: 900, margin: "0 auto" }} className="rise">
    <Eyebrow>Investments</Eyebrow>
    <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 4px" }}>Where every dollar goes</h2>
    <p style={{ color: T.slate, fontSize: 15, marginBottom: 16 }}>Monthly cost across your active engagements. Every figure is computed in code; every assumption is labelled.</p>

    <Card>
      <Label>Illustrative statutory remittance: {statutoryPct}%</Label>
      <input aria-label="Statutory remittance rate" type="range" min="0" max="35" value={statutoryPct} onChange={e => setStatutoryPct(Number(e.target.value))} style={{ width: "100%", marginTop: 8, accentColor: T.emerald }} />
      <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, marginTop: 4 }}>An assumption you control. Real remittance is computed per jurisdiction at source. Fumana platform fee is a disclosed {platformPct}%.</div>
    </Card>

    <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
      {rows.map((r, i) => <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
          <div><Label>{r.c.handle}</Label><div style={{ fontSize: 13, color: T.slate }}>{r.c.role}</div></div>
          <span style={{ fontFamily: F.mono, fontSize: 20 }}>{usd(r.monthly)}<span style={{ color: T.slate, fontSize: 12 }}> / mo</span></span>
        </div>
        <div style={{ display: "grid", gap: 1, background: T.line, border: `1px solid ${T.line}`, borderRadius: 8, overflow: "hidden" }}>
          {[
            { k: "Builder net pay", v: r.net, c: T.emerald, note: `${100 - platformPct - statutoryPct}% of total` },
            { k: "Local statutory remittance", v: r.statutory, c: T.slate, note: `${statutoryPct}% illustrative, set by the slider` },
            { k: "Fumana platform fee", v: r.platform, c: T.brass, note: `${platformPct}% disclosed` },
          ].map((w, j) => <div key={j} style={{ background: T.surface, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 14, color: w.c, fontWeight: 600 }}>{w.k}</div><div style={{ fontFamily: F.mono, fontSize: 10.5, color: T.slate, marginTop: 2 }}>{w.note}</div></div>
            <div style={{ fontFamily: F.mono, fontSize: 15, color: w.c }}>{usd(w.v)}</div>
          </div>)}
        </div>
      </Card>)}
    </div>

    <div className="dash" style={{ marginTop: 16 }}>
      <Card accent={T.emerald}><Label>Total cost vs illustrative domestic equivalent</Label>
        <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 28, color: T.emerald, marginTop: 6 }}>{usd(saving)} saved / mo</div>
        <div style={{ fontSize: 13, color: T.slate }}>Your total is {usd(totalMonthly)} / month against an illustrative domestic equivalent of {usd(domestic)} (2.4x illustrative multiplier).</div>
      </Card>
      <Card accent={T.brass}><Label>Local capital retained, per year</Label>
        <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 24, color: T.brass, marginTop: 6 }}>{usd(localRetained)}</div>
        <div style={{ fontSize: 13, color: T.slate }}>Computed: builder net pay {usd(totalNet)} × 12 × 62% retention. Illustrative.</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{["SDG 8", "SDG 9", "SDG 17"].map(s => <span key={s} style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald, border: `1px solid ${T.line}`, borderRadius: 4, padding: "2px 7px" }}>{s}</span>)}</div>
      </Card>
    </div>
    <div style={{ height: 30 }} />
  </div></Scroll>;
}

// ============================================================
// ZURI COPILOT DOCK
// Persistent floating copilot, bottom-right of the app shell. Tapping the
// resting bubble opens her panel; in the panel she thinks while generating a
// reply, speaks while it is shown, then rests.
// One Zuri renders per context: the dock shows the bubble OR the panel, never
// both. It is suppressed across the whole auth and pre-assessment flow listed
// in NO_DOCK_SCREENS, so her first appearance is the interview (where she is the
// full-size presence) and the consent opt-out is not influenced by her being
// there. The Zuri component namespaces its ids per instance, so contexts never
// collide.
// ============================================================
const NO_DOCK_SCREENS = ["signin", "consent", "onboarding", "assessinfo", "humanreview", "interview"];

// Zuri's real photo (resting) in a circular frame — the copilot's avatar since
// the SVG avatar was retired. Static: resting only.
function ZuriPhoto({ size }) {
  return <img src={zuriFace} alt="Zuri" width={size} height={size}
    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />;
}

function ZuriDock({ role }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "zuri", text: "I am Zuri, your copilot. Ask me about your profile, the assessment, or your next move." }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const voice = useZuriVoice();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, busy, open]);

  async function send() {
    const q = draft.trim();
    if (!q || busy) return;
    setMsgs(m => [...m, { from: "you", text: q }]);
    setDraft(""); setBusy(true);
    try {
      const sys = `You are Zuri, the career copilot inside Fumana, speaking to a ${role}. You are warm in manner and strict in judgment: kind about how you say things, honest about what is true. Answer in three to four plain sentences. Lead with the single most useful thing. No hype, no flattery, no em dashes.`;
      const reply = await callClaude({ system: sys, messages: [{ role: "user", content: q }], expectJson: false });
      setMsgs(m => [...m, { from: "zuri", text: reply }]); voice.speak(reply);
    } catch {
      setMsgs(m => [...m, { from: "zuri", text: "I cannot reach my reasoning right now. Try again in a moment." }]);
    }
    setBusy(false);
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} aria-label="Open Zuri, your copilot" className="fdock"
      style={{ position: "fixed", right: 20, zIndex: 50, width: 64, height: 64, borderRadius: "50%", border: `1px solid ${T.line}`, background: T.surface, boxShadow: "0 6px 20px rgba(12,26,38,0.18)", cursor: "pointer", padding: 4, display: "grid", placeItems: "center" }}>
      <ZuriPhoto size={54} />
    </button>;
  }

  return <div role="dialog" aria-label="Zuri, your copilot" onKeyDown={e => { if (e.key === "Escape") setOpen(false); }} className="fdock"
    style={{ position: "fixed", right: 20, zIndex: 50, width: 340, maxWidth: "calc(100vw - 40px)", maxHeight: "min(70vh, 560px)", display: "flex", flexDirection: "column", background: T.surface, border: `1px solid ${T.line}`, borderRadius: 16, boxShadow: "0 12px 36px rgba(12,26,38,0.22)", overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${T.line}` }}>
      <ZuriPhoto size={40} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 15 }}>Zuri</div>
        <div style={{ fontFamily: F.mono, fontSize: 10.5, color: T.slate }}>career copilot</div>
      </div>
      <button onClick={() => setOpen(false)} aria-label="Close Zuri copilot" style={{ background: "transparent", border: "none", cursor: "pointer", color: T.slate, fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
    </div>
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "grid", gap: 10, alignContent: "start" }}>
      {msgs.map((m, i) => <div key={i} style={{ justifySelf: m.from === "you" ? "end" : "start", maxWidth: "85%", background: m.from === "you" ? T.paper : "rgba(6,110,90,0.06)", border: `1px solid ${m.from === "you" ? T.line : "rgba(6,110,90,0.25)"}`, borderRadius: 10, padding: "8px 11px", fontSize: 13.5, lineHeight: 1.55 }}>{m.text}</div>)}
      {busy && <div style={{ justifySelf: "start" }}><Spinner label="Zuri is thinking..." /></div>}
    </div>
    <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${T.line}` }}>
      <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} placeholder="Ask Zuri..." style={{ flex: 1, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: "9px 11px", fontSize: 13.5 }} />
      <Btn small disabled={!draft.trim() || busy} onClick={send}>Send</Btn>
    </div>
  </div>;
}

// ============================================================
// SHELL (shared header, role switch, nav)
// ============================================================
// Shared Carbon shell: dark header + dark left side nav (mobile bottom nav),
// used by both portals. Pass nav=null for onboarding/interview (no nav chrome).
function Shell({ role, exit, nav, active, onNav, children, showZuri }) {
  const hasNav = !!nav;
  return <div className={"fshell " + (hasNav ? "hasNav" : "noNav")}>
    <header className="fhead">
      <button onClick={exit} className="fbrand" aria-label="Fumana home">FUMANA</button>
      <span style={{ color: "#8BA0AD", fontSize: 12 }}>{role} portal</span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={exit} style={{ fontFamily: F.mono, fontSize: 11, color: "#9FB0BC", background: "transparent", border: "1px solid #24343F", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>switch role</button>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: "#3E8E7E" }}>Powered by Telos</span>
      </div>
    </header>
    {hasNav && <nav className="fside" aria-label={`${role} navigation`}>
      {nav.map(([k, lbl]) => <button key={k} className={"fnav" + (active === k ? " on" : "")} aria-current={active === k ? "page" : undefined} onClick={() => onNav(k)}>{lbl}</button>)}
    </nav>}
    <main className="fmain">{children}</main>
    {hasNav && <nav className="fbot" aria-label={`${role} navigation`}>
      {nav.map(([k, lbl]) => <button key={k} className={"fbotItem" + (active === k ? " on" : "")} aria-current={active === k ? "page" : undefined} onClick={() => onNav(k)}>{lbl}</button>)}
    </nav>}
    {showZuri && <ZuriDock role={role} />}
  </div>;
}

// ============================================================
// ROOT
// ============================================================
export default function App() {
  const [view, setView] = useState("landing");
  const [builders, setBuilders] = useState(SEED_BUILDERS);
  const [pipeline, setPipeline] = useState({ shortlisted: [], interviewing: [], sow: [] });
  const addBuilder = b => setBuilders(prev => [b, ...prev]);
  return <div style={{ background: T.paper, minHeight: "100vh", color: T.ink, fontFamily: F.body }}>
    <style>{FONTS}</style>
    <ToastProvider>
      {view === "landing" && <div style={{ minHeight: "100vh" }}><Landing go={setView} /></div>}
      {view === "candidate" && <CandidateApp addBuilder={addBuilder} builders={builders} pipeline={pipeline} exit={() => setView("landing")} />}
      {view === "employer" && <EmployerApp builders={builders} pipeline={pipeline} setPipeline={setPipeline} exit={() => setView("landing")} />}
    </ToastProvider>
  </div>;
}
