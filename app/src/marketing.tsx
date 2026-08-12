import { useState } from 'react';
import {
  BrainCircuit, LineChart, Shield, Calculator, BookOpen,
  ArrowRight, Check, BadgeCheck, ArrowLeft,
} from 'lucide-react';

// Fumana marketing entry point: landing -> role selection -> auth form.
// Built to DESIGN_CONTRACT.md. Colour and type resolve to the tokens defined
// once in TOKENS below, so no component carries a raw hex. The only exception is
// the third-party sign-in marks (Google, GitHub, LinkedIn), which must keep
// their own brand colours.
//
// Every figure on these screens is computed in this file from the seeded example
// engagement and the product's real weighting, and is labelled illustrative at
// the point of use. Nothing here asserts a capability the build does not have.

const TOKENS = `
:root{
  --fu-paper:#ECEFF2; --fu-surface:#FFFFFF; --fu-mute:#E3E8EB; --fu-line:#D7DEE3;
  --fu-ink:#0C1A26; --fu-slate:#5E6E7A; --fu-slate-sm:#4A5C68;
  --fu-emerald:#066E5A; --fu-vault:#05564A; --fu-brass:#B08A2E;
  --fu-alert:#A8431F; --fu-on-accent:#F4F7F8;
  --fu-display:'Hanken Grotesk',sans-serif;
  --fu-body:'Inter',sans-serif;
  --fu-mono:'IBM Plex Mono',monospace;
}`;

// Inter is the body face app-wide per the contract. Each exported view states it
// on its own root so these screens stand up independently of the app shell.
const rootStyle = { fontFamily: 'var(--fu-body)' };
const displayStyle = { fontFamily: 'var(--fu-display)' };
const monoStyle = { fontFamily: 'var(--fu-mono)' };

const Tokens = () => <style>{TOKENS}</style>;

const Wordmark = ({ size }: { size: 'sm' | 'lg' }) => (
  <span className="flex items-center gap-2">
    <span className="w-4 h-4 bg-[var(--fu-ink)]" aria-hidden="true"></span>
    <span
      className={`text-[var(--fu-ink)] font-extrabold ${size === 'lg' ? 'text-xl' : 'text-lg'}`}
      style={{ ...displayStyle, letterSpacing: '3px' }}
    >
      FUMANA
    </span>
  </span>
);

const Footer = () => (
  <div className="text-center text-xs text-[var(--fu-slate-sm)]" style={monoStyle}>
    &copy; FIND Services Limited. Powered by Telos. Designed by Lexington Advisory Group.
  </div>
);

// A small mono caption that names an assumption at the point of use.
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-[var(--fu-slate-sm)] leading-relaxed" style={monoStyle}>{children}</p>
);

// ---- the seeded example, mirroring App.jsx ----
// These are the product's six real dimensions and their real weights, scored on
// the seeded example builder. Profile Strength is the weighted average, computed
// here exactly as the app computes it. When App.jsx exports its seed data these
// should be imported rather than restated.
const EXAMPLE_HANDLE = 'FB-2208';
const EXAMPLE_DIMENSIONS = [
  { name: 'Technical depth', score: 88, weight: 0.30 },
  { name: 'Communication clarity', score: 68, weight: 0.16 },
  { name: 'Async and remote readiness', score: 86, weight: 0.16 },
  { name: 'Professionalism', score: 84, weight: 0.14 },
  { name: 'Collaboration', score: 82, weight: 0.12 },
  { name: 'Problem solving', score: 88, weight: 0.12 },
];
// The exact weighted sum and the rounded strength the product reports. Both are
// shown, so the derivation rows add up to the figure above them.
const WEIGHTED_SUM = EXAMPLE_DIMENSIONS.reduce((sum, d) => sum + d.score * d.weight, 0);
const PROFILE_STRENGTH = Math.round(WEIGHTED_SUM);
const TIERS = [
  { name: 'Bronze', floor: 0 },
  { name: 'Silver', floor: 50 },
  { name: 'Gold', floor: 70 },
  { name: 'Top 1%', floor: 85 },
];
const tierOf = (score: number) => [...TIERS].reverse().find(t => score >= t.floor)!.name;

// The engagement figures, computed from the seeded monthly budget and the
// product's disclosed platform fee. The statutory rate is an illustrative
// assumption, the same one the employer finance screen exposes on a slider.
const EXAMPLE_MONTHLY = 4500;
const PLATFORM_PCT = 12;
const STATUTORY_PCT = 18;
const PLATFORM_FEE = Math.round((EXAMPLE_MONTHLY * PLATFORM_PCT) / 100);
const STATUTORY = Math.round((EXAMPLE_MONTHLY * STATUTORY_PCT) / 100);
const BUILDER_NET = EXAMPLE_MONTHLY - PLATFORM_FEE - STATUTORY;
const usd = (n: number) => '$' + n.toLocaleString('en-US');

// --- AUTHENTICATION FORM VIEW ---
export function AuthFormPage({ role, onBack, onAuthenticated }: { role: string; onBack: () => void; onAuthenticated: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const field = 'w-full bg-[var(--fu-surface)] border border-[var(--fu-line)] rounded-lg p-3 text-[var(--fu-ink)] focus:border-[var(--fu-emerald)] outline-none transition-colors';
  const label = 'text-xs text-[var(--fu-slate-sm)] uppercase';
  const sso = 'w-full flex items-center justify-center gap-3 bg-[var(--fu-surface)] border border-[var(--fu-line)] rounded-lg hover:bg-[var(--fu-mute)] text-[var(--fu-ink)] p-3 transition-colors font-medium';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--fu-paper)]" style={rootStyle}>
      <Tokens />
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[var(--fu-slate)] hover:text-[var(--fu-ink)] transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[var(--fu-surface)] border border-[var(--fu-line)] rounded-xl w-full max-w-md">
          <div className="p-8 border-b border-[var(--fu-line)] text-center">
            <div className="flex items-center justify-center mb-6"><Wordmark size="lg" /></div>
            <h2 className="text-2xl font-semibold text-[var(--fu-ink)] mb-2" style={displayStyle}>
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-[var(--fu-slate-sm)] uppercase" style={monoStyle}>
              {role === 'builder' ? 'For builders' : 'For employers'}
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <button onClick={onAuthenticated} className={sso}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {role === 'builder' ? (
                <button onClick={onAuthenticated} className={sso}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                  </svg>
                  Continue with GitHub
                </button>
              ) : (
                <button onClick={onAuthenticated} className={sso}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#0A66C2" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  Continue with LinkedIn
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--fu-line)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--fu-surface)] text-xs text-[var(--fu-slate-sm)] uppercase" style={monoStyle}>Or continue with email</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuthenticated(); }}>
              {isSignUp && (
                <div className="space-y-1">
                  <label className={label} style={monoStyle}>Full name</label>
                  <input type="text" className={field} placeholder="Your full name" />
                </div>
              )}
              <div className="space-y-1">
                <label className={label} style={monoStyle}>Email address</label>
                <input type="email" className={field} placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className={label} style={monoStyle}>Password</label>
                <input type="password" className={field} placeholder="Your password" />
              </div>

              <button type="submit" className="w-full bg-[var(--fu-emerald)] text-[var(--fu-on-accent)] rounded-lg p-3 font-medium hover:bg-[var(--fu-vault)] transition-colors mt-2">
                {isSignUp ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <Note>Sign-in is wired at the interface layer for this prototype. Real OIDC and SAML are a backend step.</Note>

            <div className="text-center pt-2">
              <p className="text-sm text-[var(--fu-slate)]">
                {isSignUp ? 'Already have an account?' : 'Do not have an account?'}
                <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 font-medium text-[var(--fu-emerald)] hover:underline">
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4"><Footer /></div>
    </div>
  );
}

// --- ROLE SELECTION VIEW ---
export function RoleSelectionPage({ onRoleSelect, onBack }: { onRoleSelect: (role: string) => void; onBack: () => void }) {
  const card = 'bg-[var(--fu-surface)] p-8 rounded-xl border border-[var(--fu-line)] flex flex-col items-start';
  const cta = 'bg-[var(--fu-emerald)] text-[var(--fu-on-accent)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--fu-vault)] transition-colors';

  return (
    <div className="min-h-screen bg-[var(--fu-paper)] flex flex-col items-center justify-center p-6" style={rootStyle}>
      <Tokens />
      <div className="absolute top-6 left-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[var(--fu-slate)] hover:text-[var(--fu-ink)] transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to the main site
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-[var(--fu-ink)]" style={{ ...displayStyle, letterSpacing: '3px' }}>FUMANA</h1>
          <p className="text-[var(--fu-slate)] text-lg max-w-2xl leading-relaxed">
            The talent clearing house for African engineering. One network: builders prove their worth on one side, enterprises hire it on the other, and the impact is settled in the open.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className={card}>
            <div className="text-xs text-[var(--fu-slate-sm)] uppercase mb-4" style={monoStyle}>I am a builder</div>
            <h2 className="text-2xl font-bold text-[var(--fu-ink)] mb-4" style={displayStyle}>Build a profile employers trust</h2>
            <p className="text-[var(--fu-slate)] leading-relaxed mb-8 flex-1">
              Sign in, take the interview with Zuri, and join the network with your identity shielded until you choose to reveal it.
            </p>
            <button onClick={() => onRoleSelect('builder')} className={cta}>Enter as a builder</button>
          </div>

          <div className={card}>
            <div className="text-xs text-[var(--fu-slate-sm)] uppercase mb-4" style={monoStyle}>I am an employer</div>
            <h2 className="text-2xl font-bold text-[var(--fu-ink)] mb-4" style={displayStyle}>Hire on evidence</h2>
            <p className="text-[var(--fu-slate)] leading-relaxed mb-8 flex-1">
              Search by evidence, see bias-shielded matches, sign a statement of work with liability carried for you, and see where every dollar goes.
            </p>
            <button onClick={() => onRoleSelect('employer')} className={cta}>Enter as an employer</button>
          </div>
        </div>

        <div className="space-y-4">
          <Note>Build a profile first, then enter as an employer and search. You will find yourself in the results.</Note>
          <Footer />
        </div>
      </div>
    </div>
  );
}

// --- LANDING PAGE ---
export function LandingPage({ onSignInClick }: { onSignInClick: () => void }) {
  const navLink = 'text-[var(--fu-slate)] hover:text-[var(--fu-ink)] text-sm transition-colors';
  const tile = 'bg-[var(--fu-surface)] p-8 border border-[var(--fu-line)] rounded-xl';
  const figure = 'text-[var(--fu-ink)] font-semibold';

  return (
    <div style={rootStyle}>
      <Tokens />
      <nav className="fixed w-full z-50 bg-[var(--fu-surface)] border-b border-[var(--fu-line)]">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Wordmark size="sm" />
            <div className="hidden md:flex gap-6">
              <a href="#assessment" className={navLink}>Assessment</a>
              <a href="#matching" className={navLink}>Matching</a>
              <a href="#upskilling" className={navLink}>Upskilling</a>
              <a href="#cost" className={navLink}>Cost</a>
            </div>
          </div>
          <button onClick={onSignInClick} className="px-4 py-2 bg-[var(--fu-mute)] rounded-lg text-[var(--fu-ink)] hover:bg-[var(--fu-line)] transition-colors text-sm font-medium">
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 border-b border-[var(--fu-line)]">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-semibold text-[var(--fu-ink)] leading-tight tracking-tight" style={displayStyle}>
            African talent.<br />Global scale.
          </h1>

          <p className="text-lg text-[var(--fu-slate)] max-w-xl leading-relaxed">
            Builders are assessed by Zuri across six dimensions, each score tied to the answer it came from. Employers search that evidence with identity shielded until they commit to an interview.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={onSignInClick} className="flex items-center justify-center gap-2 bg-[var(--fu-emerald)] text-[var(--fu-on-accent)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--fu-vault)] transition-colors">
              <span>Build your profile</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={onSignInClick} className="flex items-center justify-center gap-2 bg-[var(--fu-surface)] border border-[var(--fu-line)] rounded-lg text-[var(--fu-ink)] px-6 py-3 font-medium hover:bg-[var(--fu-mute)] transition-colors">
              <span>Hire a builder</span>
            </button>
          </div>
        </div>

        {/* Hero visual: a bias-shielded profile and the derivation of its score.
            Handle only. No name, no photo, no location, because that is exactly
            what an employer sees before they commit to an interview. */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-[var(--fu-surface)] border border-[var(--fu-line)] rounded-xl">
            <div className="bg-[var(--fu-mute)] rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-[var(--fu-line)]">
              <span className="text-xs text-[var(--fu-slate-sm)] uppercase" style={monoStyle}>Builder profile, as an employer sees it</span>
              <span className="text-xs text-[var(--fu-slate-sm)]" style={monoStyle}>identity shielded</span>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xl font-semibold text-[var(--fu-ink)]" style={displayStyle}>{EXAMPLE_HANDLE}</div>
                  <p className="text-xs text-[var(--fu-slate-sm)] mt-1" style={monoStyle}>no name, photo, or location</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-[var(--fu-emerald)] leading-none" style={displayStyle}>{PROFILE_STRENGTH}</div>
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 border border-[var(--fu-brass)] rounded">
                    <BadgeCheck size={12} className="text-[var(--fu-brass)]" />
                    <span className="text-xs font-medium text-[var(--fu-brass)]" style={monoStyle}>{tierOf(PROFILE_STRENGTH)}</span>
                  </span>
                </div>
              </div>

              {/* The derivation panel. Every dimension shows its score, its weight,
                  and its contribution, closing on the weighted average. */}
              <div className="border-t border-[var(--fu-line)]">
                {EXAMPLE_DIMENSIONS.map(d => (
                  <div key={d.name} className="flex justify-between items-baseline gap-4 py-2 border-b border-[var(--fu-mute)] text-sm">
                    <span className="text-[var(--fu-slate)]">{d.name}</span>
                    <span className="flex items-baseline gap-3 shrink-0" style={monoStyle}>
                      <span className={figure}>{d.score}</span>
                      <span className="text-xs text-[var(--fu-slate-sm)]">x {d.weight.toFixed(2)}</span>
                      <span className="text-xs text-[var(--fu-slate-sm)] w-12 text-right">{(d.score * d.weight).toFixed(2)}</span>
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-baseline py-3 text-sm">
                  <span className="text-[var(--fu-emerald)] font-semibold">Profile strength, weighted average</span>
                  <span className="text-[var(--fu-emerald)] font-semibold" style={monoStyle}>
                    {WEIGHTED_SUM.toFixed(2)}
                    <span className="text-xs text-[var(--fu-slate-sm)] ml-2">rounds to {PROFILE_STRENGTH}</span>
                  </span>
                </div>
              </div>

              <Note>Illustrative example profile. The six dimensions and their weights are the ones the product scores on, and the strength is the weighted average computed in code.</Note>
            </div>
          </div>
        </div>
      </header>

      {/* Cost */}
      <section className="py-12 bg-[var(--fu-ink)]" id="cost">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--fu-on-accent)] leading-tight" style={displayStyle}>
                Where every dollar goes.
              </h2>
              <p className="text-[var(--fu-mute)] text-lg leading-relaxed max-w-md">
                Fumana acts as the employer of record and carries local employment liability, tax remittance, and IP custody. The split is disclosed on the engagement, not buried in a rate card.
              </p>

              <div className="pt-4 space-y-3">
                {[
                  'Identity shielded until an employer commits to an interview',
                  'Every score tied to the answer it came from',
                  'The platform fee disclosed on every payout',
                ].map(line => (
                  <div key={line} className="flex items-center gap-3">
                    <span className="w-4 h-4 bg-[var(--fu-on-accent)] flex items-center justify-center text-[var(--fu-ink)] shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-[var(--fu-on-accent)] font-medium text-sm">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee waterfall, computed from the seeded monthly engagement. */}
            <div className="bg-[var(--fu-surface)] rounded-xl border border-[var(--fu-line)]">
              <div className="p-4 bg-[var(--fu-mute)] rounded-t-xl border-b border-[var(--fu-line)] flex justify-between items-center">
                <span className="text-xs font-semibold text-[var(--fu-ink)] uppercase" style={monoStyle}>
                  One engagement, {usd(EXAMPLE_MONTHLY)} per month
                </span>
                <Calculator size={16} className="text-[var(--fu-slate)]" />
              </div>

              <div className="p-6">
                {[
                  { k: 'Builder net pay', v: BUILDER_NET, note: `${100 - PLATFORM_PCT - STATUTORY_PCT}% of the engagement`, accent: true },
                  { k: 'Local statutory remittance', v: STATUTORY, note: `${STATUTORY_PCT}%, an illustrative assumption` },
                  { k: 'Fumana platform fee', v: PLATFORM_FEE, note: `${PLATFORM_PCT}%, disclosed` },
                ].map(row => (
                  <div key={row.k} className="flex justify-between items-baseline gap-4 py-3 border-b border-[var(--fu-mute)]">
                    <span>
                      <span className={`text-sm font-medium ${row.accent ? 'text-[var(--fu-emerald)]' : 'text-[var(--fu-ink)]'}`}>{row.k}</span>
                      <span className="block text-xs text-[var(--fu-slate-sm)] mt-1" style={monoStyle}>{row.note}</span>
                    </span>
                    <span className={`shrink-0 ${row.accent ? 'text-[var(--fu-emerald)] font-semibold' : 'text-[var(--fu-ink)]'}`} style={monoStyle}>{usd(row.v)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-baseline py-3">
                  <span className="text-sm font-semibold text-[var(--fu-ink)]">Total</span>
                  <span className="font-semibold text-[var(--fu-ink)]" style={monoStyle}>{usd(EXAMPLE_MONTHLY)}</span>
                </div>
                <div className="pt-3 border-t border-[var(--fu-line)]">
                  <Note>Illustrative, from the seeded example engagement. The platform fee is the product's real disclosed rate. The statutory rate is an assumption the employer sets on their own finance screen, since real remittance is computed per jurisdiction.</Note>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the platform does */}
      <section className="py-12 bg-[var(--fu-paper)] border-b border-[var(--fu-line)]" id="assessment">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-[var(--fu-ink)]" style={displayStyle}>What the platform does</h2>
            <p className="text-lg text-[var(--fu-slate)]">
              Four parts, each built to show its reasoning rather than assert a result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={tile}>
              <div className="w-8 h-8 bg-[var(--fu-mute)] flex items-center justify-center mb-6 text-[var(--fu-ink)]">
                <BrainCircuit size={16} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--fu-ink)] mb-3" style={displayStyle}>Assessment</h3>
              <p className="text-[var(--fu-slate)] text-sm leading-relaxed mb-8">
                Zuri interviews the builder, then Telos scores six dimensions from 0 to 100. Each score carries a written reason and the answer it was drawn from. The weighting is disclosed on the dashboard, and a builder can contest any dimension or ask for a human review.
              </p>
              <div className="bg-[var(--fu-paper)] p-4 border border-[var(--fu-line)] rounded-lg space-y-3">
                {EXAMPLE_DIMENSIONS.slice(0, 2).map(d => (
                  <div key={d.name} className="flex justify-between text-xs items-center" style={monoStyle}>
                    <span className="text-[var(--fu-slate-sm)] uppercase">{d.name}</span>
                    <span className={figure}>{d.score} / 100</span>
                  </div>
                ))}
                <p className="text-xs text-[var(--fu-slate-sm)] pt-2 border-t border-[var(--fu-line)]" style={monoStyle}>two of six, illustrative</p>
              </div>
            </div>

            <div className={tile} id="upskilling">
              <div className="w-8 h-8 bg-[var(--fu-mute)] flex items-center justify-center mb-6 text-[var(--fu-ink)]">
                <BookOpen size={16} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--fu-ink)] mb-3" style={displayStyle}>Upskilling</h3>
              <p className="text-[var(--fu-slate)] text-sm leading-relaxed mb-8">
                The dashboard computes which single dimension raises a builder's strength fastest, and points at the module for it. The Culture Shock Simulator runs five real workplace scenarios and scores the response. Tiers follow the score, on fixed bands that are the same for everyone.
              </p>
              <div className="flex gap-2">
                {TIERS.map(t => (
                  <div key={t.name} className="flex-1 bg-[var(--fu-paper)] border border-[var(--fu-line)] rounded py-2 text-center">
                    <span className="block text-xs text-[var(--fu-ink)] uppercase" style={monoStyle}>{t.name}</span>
                    <span className="block text-xs text-[var(--fu-slate-sm)] mt-1" style={monoStyle}>{t.floor}+</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={tile} id="matching">
              <div className="w-8 h-8 bg-[var(--fu-mute)] flex items-center justify-center mb-6 text-[var(--fu-ink)]">
                <LineChart size={16} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--fu-ink)] mb-3" style={displayStyle}>Matching</h3>
              <p className="text-[var(--fu-slate)] text-sm leading-relaxed mb-8">
                Employers describe the work and search the network. Results are bias-shielded: no name, photo, or location, and the role and summary stay hidden until the employer commits to an interview. The reveal is the commitment.
              </p>
              <div className="bg-[var(--fu-paper)] border border-[var(--fu-line)] rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[var(--fu-ink)]" style={monoStyle}>{EXAMPLE_HANDLE}</span>
                  <span className="text-xs text-[var(--fu-slate-sm)]" style={monoStyle}>identity shielded</span>
                </div>
                <p className="text-xs text-[var(--fu-slate-sm)] mt-2 leading-relaxed" style={monoStyle}>
                  Role and summary unlock when the employer requests an interview.
                </p>
              </div>
            </div>

            <div className={tile}>
              <div className="w-8 h-8 bg-[var(--fu-mute)] flex items-center justify-center mb-6 text-[var(--fu-ink)]">
                <Shield size={16} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--fu-ink)] mb-3" style={displayStyle}>Fair terms</h3>
              <p className="text-[var(--fu-slate)] text-sm leading-relaxed mb-6">
                Before an employer can search, they accept three commitments. These protect the builder and are a condition of using the network, not a badge.
              </p>
              <div className="bg-[var(--fu-mute)] border-l-4 border-[var(--fu-ink)] rounded-r-lg p-4">
                <ul className="list-none text-sm text-[var(--fu-ink)] space-y-2">
                  {['Fair pay for the role and region', 'Agreed hours and timezone overlap', 'No covert monitoring'].map(p => (
                    <li key={p} className="flex gap-2 items-start">
                      <Check size={16} className="shrink-0 mt-1 text-[var(--fu-slate)]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--fu-surface)] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <Wordmark size="sm" />
              <p className="text-[var(--fu-slate)] text-sm max-w-sm leading-relaxed">
                The talent clearing house for African engineering. Builders prove their worth on one side, enterprises hire it on the other.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--fu-ink)] mb-4 text-sm">For employers</h4>
              <ul className="list-none space-y-3 text-sm">
                <li><button onClick={onSignInClick} className={navLink}>Search the network</button></li>
                <li><button onClick={onSignInClick} className={navLink}>Fair terms</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--fu-ink)] mb-4 text-sm">For builders</h4>
              <ul className="list-none space-y-3 text-sm">
                <li><button onClick={onSignInClick} className={navLink}>Take the assessment</button></li>
                <li><button onClick={onSignInClick} className={navLink}>Build a profile</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--fu-line)] pt-8"><Footer /></div>
        </div>
      </footer>
    </div>
  );
}
