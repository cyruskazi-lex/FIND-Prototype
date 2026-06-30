import { useState } from "react";
import {
  LineChart, Briefcase, Wallet, Users, FileText, GraduationCap, Settings,
  User, Menu, Globe, Wifi, WifiOff, ShieldCheck, ChevronRight, ChevronLeft,
  Sparkles, X, Check, Mic, BrainCircuit, Award, Linkedin, Copy, LogOut, Star
} from "lucide-react";

// ============================================================
// Fumana candidate portal. Built on the established app shell
// (sidebar, screens, onboarding, Zuri copilot) in IBM Carbon
// design with the Fumana Clearing House palette.
// Zuri is the agent. Telos is the engine underneath.
// LIVE: Zuri interview, scoring, Experience Alchemist.
// ============================================================

const C = {
  paper: "#F2F4F7", surface: "#FFFFFF", mute: "#E3E8EB", line: "#D7DEE3", line2: "#C2CCD4",
  ink: "#0C1A26", slate: "#5E6E7A", emerald: "#066E5A", vault: "#05564A",
  brass: "#B08A2E", onDark: "#EEF3F8", onAccent: "#F4F7F8", alert: "#A8431F",
};
const F = { sans: "'IBM Plex Sans', sans-serif", mono: "'IBM Plex Mono', monospace" };

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0}
body{font-family:'IBM Plex Sans',sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
.fade{animation:fade .3s ease}
@keyframes grow{from{width:0}}
@keyframes toastin{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.grid2{display:grid;grid-template-columns:1.5fr 1fr;gap:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px}
.gridm{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.shell{display:grid;grid-template-columns:256px 1fr}
.sidenav{display:flex}
.bottomnav{display:none}
@media(max-width:880px){.shell{grid-template-columns:1fr}.sidenav{display:none}.bottomnav{display:flex}.grid2,.gridm{grid-template-columns:1fr}.grid3{grid-template-columns:1fr}}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid ${"#066E5A"};outline-offset:1px}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
textarea,input{font-family:'IBM Plex Sans',sans-serif}
`;

async function callClaude({ system, messages, expectJson }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  if (!expectJson) return text;
  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
}

const WEIGHTS = { "Technical depth": 0.30, "Communication clarity": 0.16, "Async and remote readiness": 0.16, "Professionalism": 0.14, "Collaboration": 0.12, "Problem solving": 0.12 };
const DIMENSIONS = Object.keys(WEIGHTS);
const composite = d => { let s = 0, w = 0; d.forEach(x => { const t = WEIGHTS[x.name] ?? 0.15; s += x.score * t; w += t; }); return Math.round(s / (w || 1)); };
const tierOf = s => s >= 85 ? { name: "Top 1%", color: C.emerald } : s >= 70 ? { name: "Gold", color: C.brass } : s >= 50 ? { name: "Silver", color: C.slate } : { name: "Bronze", color: C.alert };
const MODULES = {
  "Communication clarity": { title: "Culture Shock Simulator", blurb: "Western corporate communication: async updates, proactive clarification, direct feedback.", pts: 300 },
  "Async and remote readiness": { title: "Async Operating Rhythm", blurb: "Run a remote day across time zones without losing momentum.", pts: 250 },
  "Professionalism": { title: "Professional Presence", blurb: "Client-ready conduct, commitments, follow through.", pts: 200 },
  "Collaboration": { title: "Collaboration and Code Review", blurb: "Give and take review, pair effectively, raise blockers early.", pts: 220 },
  "Problem solving": { title: "Structured Problem Solving", blurb: "Frame ambiguous problems and show your reasoning.", pts: 240 },
  "Technical depth": { title: "Technical Deep Dive", blurb: "Close the gap on the skills employers ask for most.", pts: 320 },
};
const MAX_Q = 5;

// ---- Carbon atoms ----
function CBtn({ children, onClick, kind, disabled, full, icon: Icon, sm }) {
  const k = {
    primary: { background: C.emerald, color: C.onAccent, border: `1px solid ${C.emerald}` },
    secondary: { background: C.ink, color: C.onDark, border: `1px solid ${C.ink}` },
    tertiary: { background: "transparent", color: C.emerald, border: `1px solid ${C.emerald}` },
    ghost: { background: "transparent", color: C.emerald, border: "1px solid transparent" },
  }[kind || "primary"];
  return <button onClick={onClick} disabled={disabled} style={{
    ...k, fontFamily: F.sans, fontWeight: 500, fontSize: sm ? 13 : 14, padding: sm ? "8px 12px" : "11px 14px",
    borderRadius: 0, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
    width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
  }}>{children}{Icon && <Icon size={16} />}</button>;
}
const Tile = ({ children, p, accent }) => <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.line}`, padding: p ?? 20 }}>{children}</div>;
const Tag = ({ children, color }) => <span style={{ fontFamily: F.mono, fontSize: 11, color: color || C.slate, border: `1px solid ${color || C.line2}`, padding: "2px 8px", letterSpacing: 0.3 }}>{children}</span>;
const Lab = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 12, color: C.slate, letterSpacing: 0.3, textTransform: "uppercase" }}>{children}</div>;
const H = ({ children, s }) => <h2 style={{ fontFamily: F.sans, fontWeight: 600, fontSize: s || 24, color: C.ink, letterSpacing: -0.2 }}>{children}</h2>;
function Spin({ label }) { return <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.slate, fontSize: 14 }}><span style={{ width: 14, height: 14, border: `2px solid ${C.line2}`, borderTopColor: C.emerald, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />{label}</div>; }
function Bar({ v }) { return <div style={{ height: 6, background: C.mute, marginTop: 6 }}><div style={{ height: "100%", width: `${v}%`, background: v < 60 ? C.alert : C.emerald, animation: "grow 1s ease" }} /></div>; }

// ============================================================
// ONBOARDING
// ============================================================
function Welcome({ go }) {
  return <div className="fade" style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, background: C.paper }}>
    <div style={{ maxWidth: 560 }}>
      <Tag color={C.emerald}>Africa talent clearing house</Tag>
      <h1 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: C.ink, lineHeight: 1.1, letterSpacing: -1, margin: "16px 0 14px" }}>Prove your worth. Get matched globally.</h1>
      <p style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 26 }}>Build a verified profile employers trust on sight. Your identity stays shielded until you choose to reveal it. Zuri assesses how you work, not just what is on your resume.</p>
      <CBtn icon={ChevronRight} onClick={go}>Join the talent bridge</CBtn>
      <div style={{ display: "flex", gap: 22, marginTop: 22 }}>
        <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: C.slate }}><ShieldCheck size={15} color={C.emerald} /> Privacy first</span>
        <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: C.slate }}><Award size={15} color={C.brass} /> Pay equity</span>
      </div>
    </div>
  </div>;
}

function Privacy({ go, back }) {
  const [t1, setT1] = useState(false); const [t2, setT2] = useState(false);
  const Check2 = ({ on, set, title, sub, opt }) => (
    <div onClick={() => set(!on)} style={{ cursor: "pointer", border: `1px solid ${on ? C.emerald : C.line}`, borderLeft: `3px solid ${on ? C.emerald : C.line}`, background: on ? "rgba(6,110,90,0.04)" : C.surface, padding: 16, display: "flex", gap: 12 }}>
      <div style={{ width: 20, height: 20, flex: "none", marginTop: 2, background: on ? C.emerald : "transparent", border: on ? "none" : `1px solid ${C.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <Check size={14} color="#fff" />}</div>
      <div><div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>{opt && <Tag>optional</Tag>}</div><div style={{ color: C.slate, fontSize: 13, marginTop: 2 }}>{sub}</div></div>
    </div>
  );
  return <div className="fade" style={{ minHeight: "100%", overflowY: "auto", background: C.paper, padding: 28 }}>
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: F.mono, fontSize: 12, color: C.slate, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}><ChevronLeft size={14} /> back</button>
      <Lab>Onboarding . privacy</Lab>
      <H s={30}>Your data, your rules</H>
      <p style={{ color: C.slate, fontSize: 15, margin: "8px 0 18px" }}>Telos evaluates your skills to match you with global employers. It is not a data broker. You control what happens next.</p>
      <Tile accent={C.brass}><Lab>The Fumana privacy promise</Lab>
        <ul style={{ listStyle: "none", display: "grid", gap: 8, marginTop: 12, fontSize: 14, color: C.slate }}>
          <li>. Your data is never sold.</li><li>. Your psychological profile is never shared.</li><li>. You can delete everything at any time.</li>
        </ul></Tile>
      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <Check2 on={t1} set={setT1} title="Analyze my text and interview" sub="Required to generate your skills profile via Telos." />
        <Check2 on={t2} set={setT2} title="Improve the Telos engine" sub="Allow anonymized data to train the model." opt />
      </div>
      <div style={{ marginTop: 18 }}><CBtn icon={ChevronRight} disabled={!t1} onClick={go}>Agree and continue</CBtn>{!t1 && <div style={{ marginTop: 8, fontSize: 12.5, color: C.slate }}>Accept the required item to continue.</div>}</div>
      <div style={{ height: 30 }} />
    </div>
  </div>;
}

// ============================================================
// ASSESSMENT (responsible-AI explainer + live Zuri interview + scoring)
// ============================================================
function Assessment({ profile, setProfile, onDone, back }) {
  const [phase, setPhase] = useState("info"); // info, profile, interview
  // info
  const [ok, setOk] = useState(false);
  // profile
  const ready = profile.role && profile.experience.trim().length > 30;
  // interview
  const [history, setHistory] = useState([]); const [qa, setQa] = useState([]);
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState("");
  const [count, setCount] = useState(0); const [busy, setBusy] = useState(false);
  const [scoring, setScoring] = useState(false); const [err, setErr] = useState(false); const [started, setStarted] = useState(false);
  const SYS = "You are Zuri, a warm, professional AI interviewer for Fumana, assessing a builder for global remote engineering work. Conduct a brief adaptive competency interview. Ask exactly ONE question per turn, short and concrete. Adapt each question to the candidate's previous answers and their role. Across the interview, probe communication, professionalism, async and remote work, collaboration, problem solving, and technical depth. Do not score, do not summarise, do not greet repeatedly. Output only the next question.";

  async function ask(hist) { setBusy(true); setErr(false); try { const msgs = hist.length ? hist : [{ role: "user", content: `My role is ${profile.role}. My experience: ${profile.experience}. Please begin the interview.` }]; const q = await callClaude({ system: SYS, messages: msgs, expectJson: false }); setQuestion(q); setHistory([...msgs, { role: "assistant", content: q }]); } catch (e) { setErr(true); } setBusy(false); }
  async function submit() {
    if (answer.trim().length < 4) return;
    const nq = [...qa, { q: question, a: answer }]; setQa(nq);
    const nh = [...history, { role: "user", content: answer }]; setAnswer("");
    if (count + 1 >= MAX_Q) return score(nq);
    setCount(count + 1); await ask(nh);
  }
  async function score(fq) {
    setScoring(true); setErr(false);
    try {
      const tr = fq.map((x, i) => `Q${i + 1}: ${x.q}\nA${i + 1}: ${x.a}`).join("\n\n");
      const sys = "You are the Fumana scoring model, powered by Telos. Using the builder's experience and interview transcript, score six dimensions for global remote enterprise work: " + DIMENSIONS.join(", ") + ". Technical depth draws on experience and technical answers; others on the interview, not the resume alone. Score each 0 to 100 with a fair, specific one-sentence rationale grounded in what they said. Be honest, name real gaps. Return ONLY JSON, no fences. Shape: {\"dimensions\":[{\"name\":string,\"score\":number,\"rationale\":string}]}. Use exactly those six names.";
      const out = await callClaude({ system: sys, messages: [{ role: "user", content: `Experience:\n${profile.experience}\n\nInterview:\n${tr}` }], expectJson: true });
      const dims = out.dimensions || []; const cs = composite(dims);
      onDone({ dimensions: dims, profileStrength: cs, tier: tierOf(cs), weakest: [...dims].sort((a, b) => a.score - b.score)[0] });
    } catch (e) { setErr(true); setScoring(false); }
  }

  const wrap = { minHeight: "100%", overflowY: "auto", background: C.paper, padding: 28 };
  if (phase === "info") return <div className="fade" style={wrap}><div style={{ maxWidth: 660, margin: "0 auto" }}>
    <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: F.mono, fontSize: 12, color: C.slate, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}><ChevronLeft size={14} /> back</button>
    <Lab>Assessment . how you are assessed</Lab><H s={28}>How Zuri assesses you, and your choice</H>
    <p style={{ color: C.slate, fontSize: 15, margin: "8px 0 16px" }}>Before anything runs, here is exactly how this works. You are in control.</p>
    <Tile><Lab>What is measured</Lab><div style={{ display: "grid", gap: 8, marginTop: 12 }}>
      {DIMENSIONS.map(d => <div key={d} style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.mute}`, paddingTop: 8, fontSize: 13.5 }}><span style={{ fontWeight: 600 }}>{d}</span><span style={{ fontFamily: F.mono, fontSize: 12, color: C.slate }}>weight {WEIGHTS[d].toFixed(2)}</span></div>)}
    </div></Tile>
    <div style={{ height: 12 }} />
    <Tile accent={C.brass}><Lab>Method and your rights</Lab><ul style={{ listStyle: "none", display: "grid", gap: 8, marginTop: 12, fontSize: 14, color: C.slate }}>
      <li>. Zuri asks adaptive questions and an AI model scores each dimension 0 to 100 with a written reason you will see.</li>
      <li>. Profile Strength is the weighted average above, computed in code and shown to you.</li>
      <li>. You can decline AI assessment and request human review. You can delete your data anytime.</li>
    </ul>
      <label style={{ display: "flex", gap: 10, marginTop: 14, fontSize: 14, cursor: "pointer" }}><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} style={{ marginTop: 3 }} /><span>I understand how I will be assessed and consent to the AI interview.</span></label>
    </Tile>
    <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}><CBtn disabled={!ok} onClick={() => setPhase("profile")}>Continue</CBtn><CBtn kind="tertiary" onClick={() => onDone(null)}>Request human review</CBtn></div>
    <div style={{ height: 30 }} />
  </div></div>;

  if (phase === "profile") return <div className="fade" style={wrap}><div style={{ maxWidth: 620, margin: "0 auto" }}>
    <button onClick={() => setPhase("info")} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: F.mono, fontSize: 12, color: C.slate, background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}><ChevronLeft size={14} /> back</button>
    <Lab>Assessment . your profile</Lab><H s={28}>Tell us who you are</H>
    <p style={{ color: C.slate, fontSize: 15, margin: "8px 0 16px" }}>Write how you actually talk. Zuri reads this before the interview.</p>
    <Tile>
      <Inp label="Full name" v={profile.name} set={v => setProfile(p => ({ ...p, name: v }))} ph="Hidden from employers until interview" />
      <div className="gridm"><Inp label="Role" v={profile.role} set={v => setProfile(p => ({ ...p, role: v }))} ph="Backend engineer" /><Inp label="City" v={profile.city} set={v => setProfile(p => ({ ...p, city: v }))} ph="Lagos, Nigeria" /></div>
      <Inp label="Your experience, in your words" rows={5} v={profile.experience} set={v => setProfile(p => ({ ...p, experience: v }))} ph="What you built, what you handled, what broke and how you fixed it." />
    </Tile>
    <div style={{ marginTop: 16 }}><CBtn icon={ChevronRight} disabled={!ready} onClick={() => setPhase("interview")}>Start the interview</CBtn>{!ready && <div style={{ marginTop: 8, fontSize: 12.5, color: C.slate }}>Add your role and a few sentences of experience.</div>}</div>
    <div style={{ height: 30 }} />
  </div></div>;

  return <div className="fade" style={wrap}><div style={{ maxWidth: 680, margin: "0 auto" }}>
    <Lab>Assessment . AI interview with Zuri</Lab><H s={28}>A short conversation, not a form</H>
    <p style={{ color: C.slate, fontSize: 15, margin: "8px 0 16px" }}>Zuri asks {MAX_Q} questions that adapt to your answers.</p>
    {!started && <CBtn onClick={() => { setStarted(true); ask([]); }}>Begin interview with Zuri</CBtn>}
    {started && <div style={{ display: "grid", gap: 12 }}>
      {qa.map((x, i) => <div key={i}><div style={{ fontSize: 14, color: C.slate }}><b style={{ color: C.emerald, fontFamily: F.mono, fontSize: 12 }}>ZURI</b> . {x.q}</div><div style={{ marginTop: 4, fontSize: 14, background: C.surface, border: `1px solid ${C.line}`, padding: "9px 12px" }}>{x.a}</div></div>)}
      {scoring && <Tile><Spin label="Zuri is scoring your six dimensions..." /></Tile>}
      {!scoring && busy && <Tile><Spin label="Zuri is considering your answer..." /></Tile>}
      {!scoring && !busy && question && <Tile accent={C.emerald}>
        <div style={{ fontSize: 15, marginBottom: 10 }}><b style={{ color: C.emerald, fontFamily: F.mono, fontSize: 12 }}>ZURI</b> . {question}</div>
        <textarea rows={3} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Answer in a few honest sentences." style={{ width: "100%", background: C.paper, color: C.ink, border: `1px solid ${C.line}`, padding: 11, fontSize: 14, resize: "vertical" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}><span style={{ fontFamily: F.mono, fontSize: 11, color: C.slate }}>question {count + 1} of {MAX_Q}</span><CBtn sm disabled={answer.trim().length < 4} onClick={submit}>{count + 1 >= MAX_Q ? "Finish and score" : "Send answer"}</CBtn></div>
      </Tile>}
      {err && <div style={{ color: C.alert, fontSize: 14, display: "flex", gap: 12, alignItems: "center" }}>Zuri did not respond. <CBtn kind="tertiary" sm onClick={() => (scoring ? score(qa) : ask(history))}>Try again</CBtn></div>}
    </div>}
    <div style={{ height: 30 }} />
  </div></div>;
}
function Inp({ label, v, set, ph, rows }) {
  const s = { width: "100%", marginTop: 6, background: C.paper, color: C.ink, border: `1px solid ${C.line}`, padding: 10, fontSize: 14 };
  return <div style={{ marginBottom: 14 }}><Lab>{label}</Lab>{rows ? <textarea rows={rows} value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ ...s, resize: "vertical" }} /> : <input value={v} onChange={e => set(e.target.value)} placeholder={ph} style={s} />}</div>;
}

// ============================================================
// APP SCREENS
// ============================================================
function HumanReview({ go }) {
  return <ScreenPad><Lab>Assessment . human review</Lab><H s={26}>A person will assess you</H>
    <Tile><p style={{ fontSize: 14, color: C.slate, lineHeight: 1.6 }}>You declined AI assessment, which is your right. A human reviewer will complete your evaluation and your profile opens once they finish. In this prototype the queue is stubbed, so no score is produced here.</p><div style={{ marginTop: 14 }}><CBtn kind="tertiary" sm onClick={go}>Use the AI interview instead</CBtn></div></Tile>
  </ScreenPad>;
}

function Dashboard({ profile, result, toast }) {
  const tier = result.tier; const rec = MODULES[result.weakest?.name] || MODULES["Technical depth"];
  const [zuri, setZuri] = useState(""); const [zb, setZb] = useState(false); const [calc, setCalc] = useState(false);
  async function ask() { setZb(true); try { setZuri(await callClaude({ system: "You are Zuri, the career copilot inside Fumana. In three to four warm, direct sentences, tell this builder the single most valuable next move to raise their tier, grounded in their weakest dimension. No hype, no em dashes.", messages: [{ role: "user", content: `Strength ${result.profileStrength}, tier ${tier.name}, weakest ${result.weakest?.name} at ${result.weakest?.score}, role ${profile.role}.` }], expectJson: false })); } catch { setZuri("Zuri is unavailable right now."); } setZb(false); }
  return <ScreenPad>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
      <div><Lab>Growth dashboard</Lab><H>{profile.name || "Your"} profile</H><div style={{ color: C.slate, fontSize: 14, marginTop: 2 }}>{profile.role} . {profile.city || "location hidden"}</div></div>
      <div style={{ textAlign: "right" }}><div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: C.emerald, lineHeight: 1 }}>{result.profileStrength}</div><button onClick={() => setCalc(s => !s)} style={{ fontFamily: F.mono, fontSize: 11, color: C.slate, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>profile strength . how calculated</button><div style={{ marginTop: 6 }}><Tag color={tier.color}>{tier.name} tier</Tag></div></div>
    </div>
    {calc && <div style={{ marginBottom: 16 }}><Tile accent={C.brass}><Lab>How this was calculated</Lab><p style={{ fontSize: 13.5, color: C.slate, margin: "8px 0 10px" }}>Each dimension is scored 0 to 100 by an AI model. Profile Strength is their weighted average.</p><div style={{ display: "grid", gap: 4 }}>{result.dimensions.map((d, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 12, color: C.slate }}><span>{d.name}</span><span>{d.score} × {WEIGHTS[d.name]?.toFixed(2)}</span></div>)}<div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 12.5, color: C.emerald, borderTop: `1px solid ${C.mute}`, paddingTop: 6 }}><span>weighted average</span><span>{result.profileStrength}</span></div></div></Tile></div>}
    <div className="grid2">
      <Tile><Lab>Dimension scores</Lab><div style={{ display: "grid", gap: 14, marginTop: 14 }}>{result.dimensions.map((d, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ fontWeight: 500 }}>{d.name}</span><span style={{ fontFamily: F.mono, color: d.score < 60 ? C.alert : C.ink }}>{d.score}/100</span></div><Bar v={d.score} /><div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>{d.rationale}</div></div>)}</div></Tile>
      <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
        <Tile accent={C.brass}><Lab>Recommended next step</Lab><div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>{rec.title}</div><p style={{ fontSize: 13, color: C.slate, margin: "6px 0 12px" }}>{rec.blurb}</p><CBtn sm onClick={() => toast("Module added to your plan")}>Start module (+{rec.pts})</CBtn></Tile>
        <Tile accent={zuri ? C.emerald : C.line}><Lab>Zuri . career copilot</Lab>{!zuri && !zb && <div style={{ marginTop: 10 }}><CBtn kind="tertiary" sm onClick={ask}>Ask Zuri what to do next</CBtn></div>}{zb && <div style={{ marginTop: 12 }}><Spin label="Zuri is thinking..." /></div>}{zuri && <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>{zuri}</p>}</Tile>
      </div>
    </div>
  </ScreenPad>;
}

function Alchemist({ profile, toast }) {
  const [out, setOut] = useState(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState(false);
  async function run() {
    setBusy(true); setErr(false);
    try {
      const sys = "You are the Experience Alchemist inside Fumana. Convert a builder's informal account into recruiter-ready, outcome-led claims. Never invent facts. Return ONLY JSON, no fences. Shape: {\"headline\":string,\"outcomes\":[{\"statement\":string,\"basis\":string}],\"skills\":[string],\"integrity_note\":string}.";
      setOut(await callClaude({ system: sys, messages: [{ role: "user", content: profile.experience || "No experience provided." }], expectJson: true }));
    } catch (e) { setErr(true); } setBusy(false);
  }
  return <ScreenPad><Lab>Experience Alchemist</Lab><H>Turn real work into claims employers trust</H>
    <p style={{ color: C.slate, fontSize: 15, margin: "8px 0 16px" }}>Zuri transmutes your informal account into verified outcomes, and marks what it will not claim.</p>
    <div className="grid2">
      <Tile><Lab>Your account</Lab><div style={{ fontSize: 14, color: C.slate, marginTop: 10, lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 80 }}>{profile.experience || "Add your experience in the assessment step."}</div><div style={{ marginTop: 14 }}>{busy ? <Spin label="Telos is auditing for truth..." /> : <CBtn onClick={run} disabled={!profile.experience}>Run the Experience Alchemist</CBtn>}{err && <div style={{ marginTop: 10, color: C.alert, fontSize: 14 }}>Did not complete. <CBtn kind="tertiary" sm onClick={run}>Run again</CBtn></div>}</div></Tile>
      <Tile accent={out ? C.brass : C.line}><Lab>Recruiter-ready profile</Lab>{!out && <p style={{ color: C.slate, fontSize: 14, marginTop: 12 }}>Run the Alchemist to see your outcomes.</p>}
        {out && <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{out.headline}</div>
          {(out.outcomes || []).map((o, i) => <div key={i} style={{ borderLeft: `2px solid ${C.brass}`, paddingLeft: 10 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{o.statement}</div><div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>basis: {o.basis}</div></div>)}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(out.skills || []).map((s, i) => <Tag key={i} color={C.emerald}>{s}</Tag>)}</div>
          {out.integrity_note && <div style={{ background: C.paper, border: `1px solid ${C.line}`, padding: 11, fontSize: 13, color: C.slate }}><b style={{ color: C.brass }}>Integrity. </b>{out.integrity_note}</div>}
          <CBtn kind="tertiary" sm icon={Copy} onClick={() => toast("Profile copied")}>Copy to clipboard</CBtn>
        </div>}
      </Tile>
    </div>
  </ScreenPad>;
}

function Upskill({ result, points, setPoints, toast }) {
  const recName = result?.weakest?.name; const [done, setDone] = useState({});
  const list = Object.entries(MODULES);
  const complete = (name, m) => { if (done[name]) return; setDone(d => ({ ...d, [name]: true })); setPoints(p => p + m.pts); toast(`${m.pts} points earned`); };
  return <ScreenPad>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}><div><Lab>Upskill and training</Lab><H>Close the gap, earn the tier</H></div><div style={{ textAlign: "right" }}><div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: C.brass }}>{points}</div><Lab>reward points</Lab></div></div>
    <div className="gridm">{list.map(([name, m]) => { const isRec = name === recName, fin = done[name]; return <Tile key={name} accent={isRec ? C.brass : C.line}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Lab>{isRec ? "recommended for you" : "module"}</Lab>{fin && <Tag color={C.emerald}>completed</Tag>}</div><div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>{m.title}</div><p style={{ fontSize: 13, color: C.slate, margin: "6px 0 14px" }}>{m.blurb}</p><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: F.mono, fontSize: 12, color: C.emerald }}>+{m.pts} pts</span><CBtn kind={fin ? "tertiary" : "primary"} sm disabled={fin} onClick={() => complete(name, m)}>{fin ? "Done" : "Complete"}</CBtn></div></Tile>; })}</div>
  </ScreenPad>;
}

function Profile({ profile, result, toast }) {
  const tier = result?.tier || tierOf(0);
  return <ScreenPad><Lab>Profile</Lab><H>Your public, shielded profile</H>
    <div style={{ height: 16 }} />
    <Tile><div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ width: 88, height: 88, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 30 }}>{(profile.name || "FU").slice(0, 2).toUpperCase()}</div>
      <div style={{ flex: 1, minWidth: 200 }}><H s={24}>{profile.name || "Your name"}</H><div style={{ color: C.slate, fontSize: 14, margin: "4px 0 10px" }}>{profile.role} . {profile.city || "location hidden"}</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Tag color={tier.color}>{tier.name} tier</Tag><Tag color={C.emerald}>skill verified</Tag></div></div>
      <div style={{ display: "grid", gap: 8 }}><CBtn sm icon={Linkedin} onClick={() => toast("Sharing profile link")}>Share profile</CBtn><CBtn kind="tertiary" sm icon={Copy} onClick={() => toast("Link copied")}>Copy link</CBtn></div>
    </div></Tile>
    <div style={{ height: 16 }} />
    <Tile><Lab>Asynchronous elevator pitch</Lab><p style={{ fontSize: 14, color: C.slate, margin: "8px 0 14px" }}>Employers are far likelier to interview you when they can see how you communicate. Record a 60-second intro.</p>
      <div onClick={() => toast("Opening recorder")} style={{ border: `1px dashed ${C.line2}`, padding: 28, textAlign: "center", color: C.slate, cursor: "pointer" }}><Mic size={26} style={{ marginBottom: 6 }} /><div style={{ fontWeight: 600, fontSize: 14 }}>Record intro</div></div>
    </Tile>
  </ScreenPad>;
}

function Stub({ title, line }) { return <ScreenPad><Lab>{title}</Lab><H>{title}</H><Tile><p style={{ color: C.slate, fontSize: 14, lineHeight: 1.6 }}>{line}</p></Tile></ScreenPad>; }
const ScreenPad = ({ children }) => <div className="fade" style={{ padding: "24px 28px", maxWidth: 980, margin: "0 auto" }}>{children}</div>;

// ============================================================
// SHELL: header + sidenav + bottomnav + zuri + toast
// ============================================================
const NAV = [
  { id: "dashboard", icon: LineChart, label: "Growth Dashboard" },
  { id: "applications", icon: Briefcase, label: "Applications & Hub" },
  { id: "wallet", icon: Wallet, label: "Wallet & Escrow" },
  { id: "community", icon: Users, label: "Community Ecosystem" },
  { id: "cv-builder", icon: FileText, label: "Experience Alchemist" },
  { id: "upskill", icon: GraduationCap, label: "Upskill & Training" },
  { id: "settings", icon: Settings, label: "Settings & Comm" },
];
const MOBILE = [["dashboard", LineChart, "Growth"], ["applications", Briefcase, "Apps"], ["wallet", Wallet, "Wallet"], ["community", Users, "Community"], ["profile", User, "Profile"]];

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [profile, setProfile] = useState({ name: "", role: "", city: "", experience: "" });
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(120);
  const [offline, setOffline] = useState(false);
  const [toast, setToast] = useState(null);
  const [zuriOpen, setZuriOpen] = useState(false);
  const fire = m => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const onboarding = ["welcome", "privacy", "assessment", "humanreview"].includes(screen);

  const title = (NAV.find(n => n.id === screen)?.label) || (screen === "profile" ? "Profile" : "");

  return <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: F.sans }}>
    <style>{STYLE}</style>

    {toast && <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100, animation: "toastin .25s ease" }}><div style={{ background: C.ink, color: "#fff", fontSize: 13.5, padding: "10px 18px", display: "flex", gap: 10, alignItems: "center" }}><Check size={15} color={C.emerald} />{toast}</div></div>}

    {/* dark product header */}
    <div style={{ height: 48, background: C.ink, color: C.onDark, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 16, letterSpacing: 2, cursor: "pointer" }} onClick={() => setScreen(result ? "dashboard" : "welcome")}>FUMANA</span>
        {!onboarding && <span style={{ fontFamily: F.mono, fontSize: 12, color: "#8AA0AE", borderLeft: `1px solid #2A3A47`, paddingLeft: 14 }}>{title}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => { setOffline(o => !o); fire(offline ? "Back online" : "Offline sync enabled"); }} aria-label="Toggle bandwidth" style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: F.mono, fontSize: 11, color: offline ? C.brass : C.onDark, background: "transparent", border: `1px solid ${offline ? C.brass : "#2A3A47"}`, padding: "5px 9px", cursor: "pointer" }}>{offline ? <WifiOff size={13} /> : <Wifi size={13} />}{offline ? "OFFLINE" : "ONLINE"}</button>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: C.emerald }}>Powered by Telos</span>
      </div>
    </div>

    {onboarding ? (
      <div style={{ minHeight: "calc(100vh - 48px)" }}>
        {screen === "welcome" && <Welcome go={() => setScreen("privacy")} />}
        {screen === "privacy" && <Privacy go={() => setScreen("assessment")} back={() => setScreen("welcome")} />}
        {screen === "assessment" && <Assessment profile={profile} setProfile={setProfile} back={() => setScreen("privacy")} onDone={r => { if (r) { setResult(r); setScreen("dashboard"); } else { setScreen("humanreview"); } }} />}
        {screen === "humanreview" && <HumanReview go={() => setScreen("assessment")} />}
      </div>
    ) : (
      <div className="shell" style={{ minHeight: "calc(100vh - 48px)" }}>
        {/* sidenav */}
        <nav className="sidenav" style={{ flexDirection: "column", justifyContent: "space-between", background: C.surface, borderRight: `1px solid ${C.line}` }}>
          <div style={{ padding: "12px 0" }}>{NAV.map(n => { const a = screen === n.id; return <button key={n.id} onClick={() => setScreen(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", background: a ? "rgba(6,110,90,0.06)" : "transparent", borderLeft: `3px solid ${a ? C.emerald : "transparent"}`, borderTop: "none", borderRight: "none", borderBottom: "none", color: a ? C.ink : C.slate, fontWeight: a ? 600 : 400, fontSize: 14, cursor: "pointer", fontFamily: F.sans }}><n.icon size={18} />{n.label}</button>; })}</div>
          <button onClick={() => setScreen("profile")} style={{ display: "flex", gap: 10, alignItems: "center", margin: 12, padding: 12, background: C.paper, border: `1px solid ${C.line}`, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 36, height: 36, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{(profile.name || "FU").slice(0, 2).toUpperCase()}</div>
            <div style={{ overflow: "hidden" }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.name || "Your profile"}</div><div style={{ fontFamily: F.mono, fontSize: 10, color: (result?.tier || tierOf(0)).color }}>{(result?.tier || tierOf(0)).name} tier</div></div>
          </button>
        </nav>

        {/* content */}
        <main style={{ overflowY: "auto", minWidth: 0, paddingBottom: 70 }}>
          {screen === "dashboard" && (result ? <Dashboard profile={profile} result={result} toast={fire} /> : <Stub title="Growth Dashboard" line="Complete the assessment to see your dashboard." />)}
          {screen === "cv-builder" && <Alchemist profile={profile} toast={fire} />}
          {screen === "upskill" && <Upskill result={result} points={points} setPoints={setPoints} toast={fire} />}
          {screen === "profile" && <Profile profile={profile} result={result} toast={fire} />}
          {screen === "applications" && <Stub title="Applications & Hub" line="Your matches, applications, and interview invites appear here. Wired to the shared network in the assembled build." />}
          {screen === "wallet" && <Stub title="Wallet & Escrow" line="Zero-commission escrow, local payout via M-Pesa, Paystack, and Flutterwave, and your earnings ledger. Backend integration." />}
          {screen === "community" && <Stub title="Community Ecosystem" line="Fumana Squads, peer review, and the verifiable impact portfolio. Backend integration." />}
          {screen === "settings" && <Stub title="Settings & Comm" line="Language, WhatsApp and SMS notifications, two-factor, and your data vault to export or delete everything." />}
        </main>
      </div>
    )}

    {/* mobile bottom nav */}
    {!onboarding && <div className="bottomnav" style={{ position: "fixed", bottom: 0, width: "100%", background: C.surface, borderTop: `1px solid ${C.line}`, justifyContent: "space-around", padding: "8px 0", zIndex: 40 }}>
      {MOBILE.map(([id, Icon, lbl]) => { const a = screen === id; return <button key={id} onClick={() => setScreen(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: a ? C.emerald : C.slate }}><Icon size={19} /><span style={{ fontSize: 9, fontFamily: F.mono }}>{lbl}</span></button>; })}
    </div>}

    {/* Zuri copilot dock */}
    {!onboarding && <div style={{ position: "fixed", right: 18, bottom: 78, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {zuriOpen && <div style={{ background: C.surface, border: `1px solid ${C.line}`, padding: 16, maxWidth: 260, position: "relative" }}>
        <button onClick={() => setZuriOpen(false)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: C.slate }}><X size={14} /></button>
        <div style={{ display: "flex", gap: 6, alignItems: "center", color: C.emerald, marginBottom: 6 }}><Sparkles size={14} /><span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Zuri copilot</span></div>
        <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>I am Zuri. {result ? `You are ${result.profileStrength >= 85 ? "in the top tier" : "close to the next tier"}. Open Upskill and Training to climb.` : "Finish your assessment and I will guide your growth."}</p>
      </div>}
      <button onClick={() => setZuriOpen(o => !o)} aria-label="Open Zuri" style={{ width: 52, height: 52, borderRadius: "50%", background: C.ink, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(12,26,38,0.25)" }}><Sparkles size={22} color={C.emerald} /></button>
    </div>}
  </div>;
}
