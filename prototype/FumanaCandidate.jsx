import { useState } from "react";

// ============================================================
// Fumana candidate portal, MVP spine.
// Sign in, consent, profile and upload, live agentic assessment,
// scored growth dashboard with tiers, upskilling journey.
//
// LIVE: the assessment runs through Claude and scores six
// dimensions from experience plus scenario answers.
// STUBBED, flagged for backend: SSO, file storage, persistence.
// Per-dimension scores are the model's assessment. The overall
// Profile Strength and tier are composed in code.
// ============================================================

const T = {
  paper: "#ECEFF2", surface: "#FFFFFF", mute: "#E3E8EB", line: "#D7DEE3",
  ink: "#0C1A26", slate: "#5E6E7A",
  emerald: "#066E5A", vault: "#05564A", brass: "#B08A2E",
  onAccent: "#F4F7F8", alert: "#A8431F",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:rise .45s ease both}
@keyframes grow{from{width:0}}
textarea,input{font-family:'Inter',sans-serif}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.dash{display:grid;grid-template-columns:1.4fr 1fr;gap:16px}
.mods{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:680px){.row2,.dash,.mods{grid-template-columns:1fr}}
button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:2px solid #066E5A;outline-offset:2px}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

// ---- live Claude call ----
async function callClaude(system, userText, expectJson) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000, system,
      messages: [{ role: "user", content: userText }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  if (!expectJson) return text;
  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
}

// ---- scoring composed in code ----
const WEIGHTS = {
  "Technical depth": 0.30, "Communication clarity": 0.16, "Professionalism": 0.14,
  "Async and remote readiness": 0.16, "Collaboration": 0.12, "Problem solving": 0.12,
};
function composite(dims) {
  let s = 0, w = 0;
  dims.forEach(d => { const wt = WEIGHTS[d.name] ?? 0.15; s += d.score * wt; w += wt; });
  return Math.round(s / (w || 1));
}
function tierOf(score) {
  if (score >= 85) return { name: "Top 1%", color: T.emerald };
  if (score >= 70) return { name: "Gold", color: T.brass };
  if (score >= 50) return { name: "Silver", color: T.slate };
  return { name: "Bronze", color: T.alert };
}

// recommended module per weakest dimension
const MODULES = {
  "Communication clarity": { id: "culture", title: "Culture Shock Simulator", blurb: "Western corporate communication: async updates, proactive clarification, direct feedback.", pts: 300 },
  "Async and remote readiness": { id: "async", title: "Async Operating Rhythm", blurb: "Run a remote day across time zones without losing momentum.", pts: 250 },
  "Professionalism": { id: "prof", title: "Professional Presence", blurb: "Client-ready conduct, commitments, and follow through.", pts: 200 },
  "Collaboration": { id: "collab", title: "Collaboration and Code Review", blurb: "Give and take review, pair effectively, raise blockers early.", pts: 220 },
  "Problem solving": { id: "solve", title: "Structured Problem Solving", blurb: "Frame ambiguous problems and show your reasoning.", pts: 240 },
  "Technical depth": { id: "deep", title: "Technical Deep Dive", blurb: "Close the gap on the skills employers ask for most.", pts: 320 },
};

const SCENARIOS = [
  { id: "q1", dim: "Communication", prompt: "Your manager in Berlin sends a blunt message: \"This is not what I asked for. Redo it.\" How do you respond?" },
  { id: "q2", dim: "Async", prompt: "You will be offline for six hours due to a power outage. Your team is in three time zones. What do you do before you go dark?" },
  { id: "q3", dim: "Problem solving", prompt: "A task is ambiguous and the person who assigned it is asleep. How do you proceed without stalling?" },
  { id: "q4", dim: "Technical depth", prompt: "Describe a hard bug or failure you fixed. How did you find the root cause, and what did you change?" },
];

// ---- shared ui ----
const F = { disp: "'Hanken Grotesk', sans-serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" };

function Btn({ children, onClick, kind, disabled, full }) {
  const s = {
    primary: { background: T.emerald, color: T.onAccent, border: "none" },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.line}` },
    sso: { background: T.surface, color: T.ink, border: `1px solid ${T.line}` },
  }[kind || "primary"];
  return <button onClick={onClick} disabled={disabled} style={{
    ...s, fontFamily: F.disp, fontWeight: 600, fontSize: 14, padding: "12px 18px",
    borderRadius: 8, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
  }}>{children}</button>;
}
function Spinner({ label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.slate, fontSize: 14 }}>
    <span style={{ width: 14, height: 14, border: `2px solid ${T.line}`, borderTopColor: T.emerald, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
    {label}</div>;
}
const Label = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate, letterSpacing: 0.4, textTransform: "uppercase" }}>{children}</div>;
const Eyebrow = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>{children}</div>;
const Back = ({ onClick }) => <button onClick={onClick} aria-label="Go back" style={{ fontFamily: F.mono, fontSize: 12, color: T.slate, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 8 }}>← back</button>;
const Hint = ({ show, children }) => show ? <div role="status" style={{ marginTop: 8, fontSize: 12.5, color: T.slate }}>{children}</div> : null;
function Card({ children, accent, pad }) {
  return <div style={{ background: T.surface, border: `1px solid ${accent || T.line}`, borderRadius: 12, padding: pad ?? 22 }}>{children}</div>;
}
function Field({ label, value, onChange, placeholder, rows }) {
  const common = { width: "100%", marginTop: 7, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, lineHeight: 1.5 };
  return <div style={{ marginBottom: 14 }}>
    <Label>{label}</Label>
    {rows ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...common, resize: "vertical" }} />
      : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={common} />}
  </div>;
}

// ============================================================
// AUTH
// ============================================================
function SignIn({ onNext }) {
  return <Centered>
    <div style={{ width: "100%", maxWidth: 420 }} className="rise">
      <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 30, letterSpacing: 3 }}>FUMANA</div>
      <div style={{ color: T.slate, marginTop: 6, fontSize: 15 }}>Africa talent clearing house. Build a profile employers can trust on sight.</div>
      <div style={{ marginTop: 26, display: "grid", gap: 10 }}>
        <Btn kind="sso" full onClick={onNext}><Dot c="#EA4335" />Continue with Google</Btn>
        <Btn kind="sso" full onClick={onNext}><Dot c="#2F6FED" />Continue with Microsoft</Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: T.slate, fontSize: 12, margin: "6px 0" }}>
          <span style={{ flex: 1, height: 1, background: T.line }} />or<span style={{ flex: 1, height: 1, background: T.line }} />
        </div>
        <Btn full onClick={onNext}>Sign up with email</Btn>
      </div>
      <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 11, color: T.slate, lineHeight: 1.6 }}>
        SSO is wired at the UI layer for this prototype. Real OIDC and SAML, Google Workspace and Microsoft Entra ID, are a backend step.
      </div>
    </div>
  </Centered>;
}
const Dot = ({ c }) => <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />;

// ============================================================
// CONSENT
// ============================================================
function Consent({ onNext, onBack }) {
  const [ok, setOk] = useState(false);
  return <Centered>
    <div style={{ width: "100%", maxWidth: 480 }} className="rise">
      <Back onClick={onBack} />
      <Eyebrow>Step 1 of 3 . Consent</Eyebrow>
      <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 24, margin: "8px 0 6px" }}>How Fumana protects you</h2>
      <Card pad={20}>
        <ul style={{ listStyle: "none", display: "grid", gap: 12, fontSize: 14 }}>
          <Li><b>Bias shield.</b> Your name, photo, location, and gender stay hidden from employers until you accept an interview. They see verified capability first.</Li>
          <Li><b>You own your data.</b> You can export or delete your profile at any time.</Li>
          <Li><b>Honest assessment.</b> Telos scores your strengths and names your gaps plainly, then helps you close them.</Li>
        </ul>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontSize: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} style={{ marginTop: 3 }} />
          <span>I understand and agree to the bias-shielded process and data terms.</span>
        </label>
      </Card>
      <div style={{ marginTop: 16 }}><Btn full disabled={!ok} onClick={onNext}>Continue</Btn>
        <Hint show={!ok}>Tick the box above to continue.</Hint></div>
    </div>
  </Centered>;
}
const Li = ({ children }) => <li style={{ display: "flex", gap: 9 }}><span style={{ color: T.emerald }}>.</span><span style={{ color: T.slate }}>{children}</span></li>;

// ============================================================
// ONBOARDING + UPLOAD
// ============================================================
function Onboarding({ profile, setProfile, onNext, onBack }) {
  const [fileName, setFileName] = useState("");
  function readFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setFileName(f.name);
    if (/\.(txt|md)$/i.test(f.name)) {
      const r = new FileReader();
      r.onload = () => setProfile(p => ({ ...p, experience: (p.experience ? p.experience + "\n" : "") + r.result }));
      r.readAsText(f);
    }
  }
  const ready = profile.role && profile.experience.trim().length > 30;
  return <Scroll>
    <div style={{ maxWidth: 640, margin: "0 auto" }} className="rise">
      <Back onClick={onBack} />
      <Eyebrow>Step 2 of 3 . Profile</Eyebrow>
      <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 4px" }}>Tell us who you are</h2>
      <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Write how you actually talk. Telos turns it into recruiter-ready outcomes later. Upload a CV if you have one.</p>
      <Card>
        <Field label="Full name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Stays hidden from employers until interview" />
        <div className="row2">
          <Field label="Role" value={profile.role} onChange={v => setProfile(p => ({ ...p, role: v }))} placeholder="Backend engineer" />
          <Field label="City" value={profile.city} onChange={v => setProfile(p => ({ ...p, city: v }))} placeholder="Lagos, Nigeria" />
        </div>
        <Field label="Your experience, in your words" rows={6} value={profile.experience} onChange={v => setProfile(p => ({ ...p, experience: v }))} placeholder="What have you built, what did you handle, what went wrong and how did you fix it." />
        <div style={{ border: `1px dashed ${T.line}`, borderRadius: 10, padding: 16, textAlign: "center", background: T.paper }}>
          <label style={{ cursor: "pointer", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, color: T.slate, fontSize: 13 }}>
            <span style={{ fontFamily: F.mono, color: T.emerald }}>upload CV</span>
            <span>{fileName || "txt or md reads in now. PDF and docx parse on the backend."}</span>
            <input type="file" accept=".txt,.md,.pdf,.docx" onChange={readFile} style={{ display: "none" }} />
          </label>
        </div>
      </Card>
      <div style={{ marginTop: 16, marginBottom: 30 }}><Btn full disabled={!ready} onClick={onNext}>Continue to assessment</Btn>
        <Hint show={!ready}>Add your role and a few sentences of experience to continue.</Hint></div>
    </div>
  </Scroll>;
}

// ============================================================
// ASSESSMENT (live)
// ============================================================
function Assessment({ profile, onScored, onBack }) {
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const answered = SCENARIOS.every(s => (answers[s.id] || "").trim().length > 8);

  async function run() {
    setBusy(true); setErr(false);
    try {
      const sys =
        "You are the Fumana assessment engine, powered by Telos. Assess a builder for global remote enterprise work across six dimensions: " +
        "Technical depth, Communication clarity, Professionalism, Async and remote readiness, Collaboration, Problem solving. " +
        "Technical depth draws on their experience AND their bug-and-root-cause answer. The other dimensions draw on their experience AND their scenario answers, not the resume alone. " +
        "Score each dimension 0 to 100 with a fair, specific one-sentence rationale grounded in what they wrote. Be honest: name real gaps. Return ONLY JSON, no fences. Shape: " +
        "{\"dimensions\":[{\"name\":string,\"score\":number,\"rationale\":string}]}. Use exactly those six dimension names.";
      const input =
        `Experience:\n${profile.experience}\n\nScenario answers:\n` +
        SCENARIOS.map(s => `[${s.dim}] ${s.prompt}\nAnswer: ${answers[s.id] || ""}`).join("\n\n");
      const out = await callClaude(sys, input, true);
      const dims = out.dimensions || [];
      const score = composite(dims);
      const weakest = [...dims].sort((a, b) => a.score - b.score)[0];
      onScored({ dimensions: dims, profileStrength: score, tier: tierOf(score), weakest });
    } catch (e) { setErr(true); }
    setBusy(false);
  }

  return <Scroll>
    <div style={{ maxWidth: 640, margin: "0 auto" }} className="rise">
      <Back onClick={onBack} />
      <Eyebrow>Step 3 of 3 . Assessment</Eyebrow>
      <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "8px 0 4px" }}>This is more than your resume</h2>
      <p style={{ color: T.slate, fontSize: 15, marginBottom: 18 }}>Answer four short prompts. Telos reads these alongside your experience to score how you communicate, collaborate, work across time zones, and reason through hard problems, not just what you can build.</p>
      {SCENARIOS.map((s, i) => (
        <Card key={s.id}>
          <Label>{`Situation ${i + 1} . ${s.dim}`}</Label>
          <p style={{ fontSize: 15, margin: "8px 0 4px", color: T.ink }}>{s.prompt}</p>
          <textarea rows={3} value={answers[s.id] || ""} onChange={e => setAnswers(a => ({ ...a, [s.id]: e.target.value }))}
            placeholder="A few honest sentences." style={{ width: "100%", marginTop: 6, background: T.paper, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: 11, fontSize: 14, resize: "vertical" }} />
        </Card>
      )).reduce((acc, el) => [...acc, el, <div key={el.key + "g"} style={{ height: 14 }} />], [])}
      <div style={{ marginTop: 4, marginBottom: 30 }}>
        {busy ? <Spinner label="Telos is assessing across six dimensions..." />
          : <Btn full disabled={!answered} onClick={run}>Run my assessment</Btn>}
        <Hint show={!answered && !busy}>Answer all four prompts to run your assessment.</Hint>
        {err && <div style={{ marginTop: 12, color: T.alert, fontSize: 14, display: "flex", gap: 12, alignItems: "center" }}>
          The assessment did not complete. <Btn kind="ghost" onClick={run}>Run again</Btn></div>}
      </div>
    </div>
  </Scroll>;
}

// ============================================================
// GROWTH DASHBOARD
// ============================================================
function Dashboard({ profile, result, onUpskill }) {
  const tier = result.tier;
  const rec = MODULES[result.weakest?.name] || MODULES["Technical depth"];
  const [zuri, setZuri] = useState(""); const [zb, setZb] = useState(false);

  async function askZuri() {
    setZb(true);
    try {
      const sys = "You are Zuri, the Telos career copilot inside Fumana. In three to four warm, direct sentences, tell this builder the single most valuable next move to raise their tier, grounded in their weakest dimension. No hype, no em dashes.";
      const ctx = `Profile strength ${result.profileStrength}, tier ${tier.name}. Weakest: ${result.weakest?.name} at ${result.weakest?.score}. Role ${profile.role || "engineer"}.`;
      setZuri(await callClaude(sys, ctx, false));
    } catch { setZuri("Zuri is unavailable right now. Try again in a moment."); }
    setZb(false);
  }

  return <Scroll>
    <div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Eyebrow>Growth dashboard</Eyebrow>
          <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 2px" }}>{profile.name || "Your"} profile</h2>
          <div style={{ color: T.slate, fontSize: 14 }}>{profile.role} . {profile.city || "location hidden"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 46, color: T.emerald, lineHeight: 1 }}>{result.profileStrength}</div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate }}>profile strength . computed</div>
          <span style={{ display: "inline-block", marginTop: 6, fontFamily: F.mono, fontSize: 12, color: T.onAccent, background: tier.color, borderRadius: 5, padding: "3px 10px" }}>{tier.name} tier</span>
        </div>
      </div>

      <div className="dash" style={{ marginTop: 20 }}>
        <Card>
          <Label>Dimension scores</Label>
          <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
            {result.dimensions.map((d, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: T.ink, fontWeight: 500 }}>{d.name}</span>
                  <span style={{ fontFamily: F.mono, color: d.score < 60 ? T.alert : T.ink }}>{d.score}/100</span>
                </div>
                <div style={{ height: 7, background: T.mute, borderRadius: 4, marginTop: 5 }}>
                  <div style={{ height: "100%", width: `${d.score}%`, background: d.score < 60 ? T.alert : T.emerald, borderRadius: 4, animation: "grow 1s ease" }} />
                </div>
                <div style={{ fontSize: 12, color: T.slate, marginTop: 4 }}>{d.rationale}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <Card accent={T.brass}>
            <Label>Recommended intervention</Label>
            <div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{rec.title}</div>
            <p style={{ fontSize: 13.5, color: T.slate, margin: "6px 0 12px" }}>{rec.blurb}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>+{rec.pts} pts</span>
              <Btn onClick={onUpskill}>Start module</Btn>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: T.slate }}>Your weakest dimension is <b>{result.weakest?.name}</b>. Closing it lifts your tier fastest.</div>
          </Card>
          <Card accent={zuri ? T.emerald : T.line}>
            <Label>Zuri . career copilot</Label>
            {!zuri && !zb && <div style={{ marginTop: 10 }}><Btn kind="ghost" onClick={askZuri}>Ask Zuri what to do next</Btn></div>}
            {zb && <div style={{ marginTop: 12 }}><Spinner label="Zuri is thinking..." /></div>}
            {zuri && <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>{zuri}</p>}
          </Card>
        </div>
      </div>
      <div style={{ height: 30 }} />
    </div>
  </Scroll>;
}

// ============================================================
// UPSKILL JOURNEY
// ============================================================
function Upskill({ result, points, setPoints }) {
  const recId = (MODULES[result.weakest?.name] || {}).id;
  const list = Object.values(MODULES);
  const [done, setDone] = useState({});
  function complete(m) { if (done[m.id]) return; setDone(d => ({ ...d, [m.id]: true })); setPoints(p => p + m.pts); }

  return <Scroll>
    <div style={{ maxWidth: 860, margin: "0 auto" }} className="rise">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><Eyebrow>Upskilling journey</Eyebrow>
          <h2 style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 26, margin: "6px 0 0" }}>Close the gap, earn the tier</h2></div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 30, color: T.brass, lineHeight: 1 }}>{points}</div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: T.slate }}>reward points</div>
        </div>
      </div>
      <div className="mods" style={{ marginTop: 20 }}>
        {list.map(m => {
          const isRec = m.id === recId, finished = done[m.id];
          return <Card key={m.id} accent={isRec ? T.brass : T.line}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Label>{isRec ? "recommended for you" : "module"}</Label>
              {finished && <span style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald }}>completed</span>}
            </div>
            <div style={{ fontFamily: F.disp, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{m.title}</div>
            <p style={{ fontSize: 13.5, color: T.slate, margin: "6px 0 14px" }}>{m.blurb}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: F.mono, fontSize: 12, color: T.emerald }}>+{m.pts} pts</span>
              <Btn kind={finished ? "ghost" : "primary"} disabled={finished} onClick={() => complete(m)}>{finished ? "Done" : "Complete module"}</Btn>
            </div>
          </Card>;
        })}
      </div>
      <div style={{ marginTop: 18 }}>
        <Card>
          <Label>Achievements</Label>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <Badge on={true} label="Profile verified" />
            <Badge on={result.profileStrength >= 50} label="Silver reached" />
            <Badge on={result.profileStrength >= 70} label="Gold reached" />
            <Badge on={Object.keys(done).length >= 1} label="First module" />
            <Badge on={points >= 500} label="500 points" />
          </div>
        </Card>
      </div>
      <div style={{ height: 30 }} />
    </div>
  </Scroll>;
}
const Badge = ({ on, label }) => <span style={{
  fontFamily: F.mono, fontSize: 12, padding: "6px 11px", borderRadius: 6,
  border: `1px solid ${on ? T.emerald : T.line}`, color: on ? T.emerald : T.slate,
  background: on ? "rgba(6,110,90,0.06)" : "transparent",
}}>{on ? "✓ " : "○ "}{label}</span>;

// ============================================================
// layout helpers + shell
// ============================================================
function Centered({ children }) {
  return <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>{children}</div>;
}
function Scroll({ children }) {
  return <div style={{ height: "100%", overflowY: "auto", padding: "26px 24px" }}>{children}</div>;
}

const NAV = [["dashboard", "Dashboard"], ["upskill", "Upskilling"]];

export default function App() {
  const [screen, setScreen] = useState("signin");
  const [profile, setProfile] = useState({ name: "", role: "", city: "", experience: "" });
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(0);
  const inApp = ["dashboard", "upskill"].includes(screen);

  return (
    <div style={{ background: T.paper, minHeight: "100vh", color: T.ink, fontFamily: F.body }}>
      <style>{FONTS}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: `1px solid ${T.line}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: F.disp, fontWeight: 800, fontSize: 20, letterSpacing: 3 }}>FUMANA</span>
            <span style={{ color: T.slate, fontSize: 12 }}>candidate portal</span>
          </div>
          {inApp && <nav style={{ display: "flex", gap: 6 }}>
            {NAV.map(([k, lbl]) => (
              <button key={k} onClick={() => setScreen(k)} style={{
                fontFamily: F.body, fontSize: 13.5, fontWeight: screen === k ? 600 : 400, cursor: "pointer",
                background: screen === k ? T.surface : "transparent", color: screen === k ? T.ink : T.slate,
                border: `1px solid ${screen === k ? T.emerald : T.line}`, borderRadius: 7, padding: "7px 13px",
              }}>{lbl}</button>
            ))}
          </nav>}
          <span style={{ fontFamily: F.mono, fontSize: 11, color: T.emerald }}>Powered by Telos</span>
        </div>

        {/* body */}
        <div style={{ flex: 1, minHeight: 0 }}>
          {screen === "signin" && <SignIn onNext={() => setScreen("consent")} />}
          {screen === "consent" && <Consent onNext={() => setScreen("onboarding")} onBack={() => setScreen("signin")} />}
          {screen === "onboarding" && <Onboarding profile={profile} setProfile={setProfile} onNext={() => setScreen("assessment")} onBack={() => setScreen("consent")} />}
          {screen === "assessment" && <Assessment profile={profile} onScored={(r) => { setResult(r); setPoints(120); setScreen("dashboard"); }} onBack={() => setScreen("onboarding")} />}
          {screen === "dashboard" && result && <Dashboard profile={profile} result={result} onUpskill={() => setScreen("upskill")} />}
          {screen === "upskill" && result && <Upskill result={result} points={points} setPoints={setPoints} />}
        </div>
      </div>
    </div>
  );
}
