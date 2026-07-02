import { useState } from 'react';
import {
  BrainCircuit, LineChart, Shield, Calculator, BookOpen, Briefcase,
  Search, ArrowRight, ArrowUpRight, Check, AlertTriangle, BadgeCheck, ArrowLeft,
} from 'lucide-react';

// Fumana marketing entry point: landing -> role selection -> auth form.
// Tailwind-styled and kept separate from the inline-styled app shell. lucide-react
// 1.x removed the Github/Linkedin brand icons, so those use inline brand SVGs
// (the file already used an inline SVG for Google).

const GithubMark = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);
const LinkedinMark = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

// --- AUTHENTICATION FORM VIEW ---
export function AuthFormPage({ role, onBack, onAuthenticated }: { role: string; onBack: () => void; onAuthenticated: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F7]">
      {/* Top Bar */}
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5E6E7A] hover:text-[#0C1A26] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#FFFFFF] border border-[#D7DEE3] w-full max-w-md shadow-sm">
          {/* Header */}
          <div className="p-8 border-b border-[#D7DEE3] text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-4 h-4 bg-[#0C1A26]"></div>
              <span className="font-semibold text-xl tracking-tight text-[#0C1A26]">FUMANA</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#0C1A26] mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase">
              {role === 'builder' ? 'Builder Node Access' : 'Enterprise Gateway'}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">

            {/* SSO Options */}
            <div className="space-y-3">
              <button onClick={onAuthenticated} className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] border border-[#D7DEE3] hover:bg-[#E3E8EB] text-[#0C1A26] p-3 transition-colors font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {role === 'builder' ? (
                <button onClick={onAuthenticated} className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] border border-[#D7DEE3] hover:bg-[#E3E8EB] text-[#0C1A26] p-3 transition-colors font-medium">
                  <GithubMark />
                  Continue with GitHub
                </button>
              ) : (
                <button onClick={onAuthenticated} className="w-full flex items-center justify-center gap-3 bg-[#FFFFFF] border border-[#D7DEE3] hover:bg-[#E3E8EB] text-[#0C1A26] p-3 transition-colors font-medium">
                  <LinkedinMark />
                  Continue with LinkedIn
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D7DEE3]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FFFFFF] font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuthenticated(); }}>
              {isSignUp && (
                <div className="space-y-1">
                  <label className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#FFFFFF] border border-[#D7DEE3] p-3 text-[#0C1A26] focus:border-[#066E5A] outline-none transition-colors"
                    placeholder="Amara K."
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-[#FFFFFF] border border-[#D7DEE3] p-3 text-[#0C1A26] focus:border-[#066E5A] outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase">Password</label>
                  {!isSignUp && (
                    <a href="#" className="font-['IBM_Plex_Mono',monospace] text-xs text-[#066E5A] hover:underline">Forgot?</a>
                  )}
                </div>
                <input
                  type="password"
                  className="w-full bg-[#FFFFFF] border border-[#D7DEE3] p-3 text-[#0C1A26] focus:border-[#066E5A] outline-none transition-colors"
                  placeholder="********"
                />
              </div>

              <button type="submit" className="w-full bg-[#066E5A] text-[#F4F7F8] p-3 font-medium hover:bg-[#05564A] transition-colors mt-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* OIDC/SAML backend flag (kept from the prototype's SSO screens) */}
            <p className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#5E6E7A] leading-relaxed text-center">
              SSO is wired at the UI layer for this prototype. Real OIDC and SAML are a backend step.
            </p>

            <div className="text-center pt-2">
              <p className="text-sm text-[#5E6E7A]">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 font-medium text-[#066E5A] hover:underline"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
      <footer className="p-4 text-center font-['IBM_Plex_Mono',monospace] text-[11px] text-[#5E6E7A]">
        &copy; FIND Services Limited. Powered by Telos. Designed by Lexington Advisory Group.
      </footer>
    </div>
  );
}

// --- ROLE SELECTION VIEW ---
export function RoleSelectionPage({ onRoleSelect, onBack }: { onRoleSelect: (role: string) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col items-center justify-center p-6">

      {/* Absolute positioned back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5E6E7A] hover:text-[#0C1A26] transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to main site
        </button>
      </div>

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-10 space-y-4">
          <h1 className="text-[40px] font-bold text-[#0C1A26] tracking-widest uppercase">FUMANA</h1>
          <p className="text-[#5E6E7A] text-[20px] max-w-[700px] leading-relaxed">
            The talent clearing house for African engineering. One network: builders prove their worth on one side, enterprises hire it on the other, and the impact is settled in the open.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* Builder Card */}
          <div className="bg-[#FFFFFF] p-10 rounded-xl border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors shadow-sm flex flex-col items-start">
            <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase tracking-wider mb-4">
              I am a builder
            </div>
            <h2 className="text-2xl font-bold text-[#0C1A26] mb-4">
              Build a profile employers trust
            </h2>
            <p className="text-[#5E6E7A] leading-relaxed mb-8 flex-1">
              Sign in, take the AI interview, and join the network with your identity shielded until you choose to reveal it.
            </p>
            <button
              onClick={() => onRoleSelect('builder')}
              className="bg-[#066E5A] text-[#F4F7F8] px-6 py-3 rounded font-medium hover:bg-[#05564A] transition-colors"
            >
              Enter as a builder
            </button>
          </div>

          {/* Employer Card */}
          <div className="bg-[#FFFFFF] p-10 rounded-xl border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors shadow-sm flex flex-col items-start">
            <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase tracking-wider mb-4">
              I am an employer
            </div>
            <h2 className="text-2xl font-bold text-[#0C1A26] mb-4">
              Hire verified talent
            </h2>
            <p className="text-[#5E6E7A] leading-relaxed mb-8 flex-1">
              Search by evidence, see bias-shielded matches, sign an SOW with liability carried for you, and see where every dollar goes.
            </p>
            <button
              onClick={() => onRoleSelect('employer')}
              className="bg-[#066E5A] text-[#F4F7F8] px-6 py-3 rounded font-medium hover:bg-[#05564A] transition-colors"
            >
              Enter as an employer
            </button>
          </div>
        </div>

        {/* Footnotes */}
        <div className="space-y-6">
          <p className="font-['IBM_Plex_Mono',monospace] text-[13px] text-[#5E6E7A]">
            Tip: build a profile first, then enter as an employer and search. You will find yourself in the results.
          </p>
          <p className="font-['IBM_Plex_Mono',monospace] text-[13px] text-[#5E6E7A]">
            &copy; FIND Services Limited. Powered by Telos. Designed by Lexington Advisory Group.
          </p>
        </div>

      </div>
    </div>
  );
}

// --- LANDING PAGE ---
export function LandingPage({ onSignInClick }: { onSignInClick: () => void }) {
  return (
    <>
      <nav className="fixed w-full z-50 bg-[#FFFFFF] border-b border-[#D7DEE3]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#0C1A26]"></div>
              <span className="font-semibold text-lg tracking-tight text-[#0C1A26]">FUMANA</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#assessment" className="text-[#5E6E7A] hover:text-[#0C1A26] text-sm transition-colors">Assessment</a>
              <a href="#matching" className="text-[#5E6E7A] hover:text-[#0C1A26] text-sm transition-colors">Matching</a>
              <a href="#upskilling" className="text-[#5E6E7A] hover:text-[#0C1A26] text-sm transition-colors">Upskilling</a>
              <a href="#roi" className="text-[#5E6E7A] hover:text-[#0C1A26] text-sm transition-colors">Employer ROI</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Search size={16} className="text-[#5E6E7A] hover:text-[#0C1A26] cursor-pointer" />
            <button
              onClick={onSignInClick}
              className="px-4 py-2 bg-[#E3E8EB] text-[#0C1A26] hover:bg-[#D7DEE3] transition-colors text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 border-b border-[#D7DEE3]">
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#D7DEE3]">
            <div className="w-2 h-2 bg-[#0C1A26]"></div>
            <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase tracking-wide">
              System Live &bull; V2.4
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-semibold text-[#0C1A26] leading-[1.05] tracking-tight">
            African talent.<br />
            Global scale.
          </h1>

          <p className="text-lg text-[#5E6E7A] max-w-xl leading-relaxed">
            Systematically connecting verified African engineers to global enterprise requirements through Telos assessment, verified upskilling, and bidirectional matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onSignInClick}
              className="flex items-center justify-center space-x-2 bg-[#066E5A] text-[#F4F7F8] px-6 py-3 font-medium hover:bg-[#05564A] transition-colors"
            >
              <span>Initialize Placement</span>
              <ArrowRight size={18} />
            </button>
            <button className="flex items-center justify-center space-x-2 bg-[#FFFFFF] border border-[#D7DEE3] text-[#0C1A26] px-6 py-3 font-medium hover:bg-[#E3E8EB] transition-colors">
              <span>View Technical Docs</span>
            </button>
          </div>
        </div>

        {/* Hero Visual - Strict Data Dashboard */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-[#FFFFFF] border border-[#D7DEE3] flex flex-col">

            {/* Header Data */}
            <div className="bg-[#E3E8EB] h-10 flex items-center px-4 border-b border-[#D7DEE3] justify-between">
              <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] uppercase tracking-wider">
                ID: Match_Engine_Active
              </span>
              <span className="font-['IBM_Plex_Mono',monospace] text-xs text-[#0C1A26]">
                REQ: 8992-REACT
              </span>
            </div>

            <div className="flex flex-1 min-h-[360px]">
              {/* Sidebar Roster */}
              <div className="w-1/3 bg-[#F2F4F7] border-r border-[#D7DEE3] p-4">
                <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#5E6E7A] uppercase tracking-wider mb-4 border-b border-[#D7DEE3] pb-2">
                  Pool Pipeline
                </div>
                <div className="space-y-2">
                  <div className="bg-[#FFFFFF] border border-[#0C1A26] p-3 cursor-pointer">
                    <div className="text-sm font-semibold text-[#0C1A26]">Amara K.</div>
                    <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#0C1A26] mt-1">94% MATCH</div>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-[#E3E8EB] transition-colors border border-transparent">
                    <div className="text-sm font-medium text-[#5E6E7A]">James A.</div>
                    <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] mt-1">89% MATCH</div>
                  </div>
                </div>
              </div>

              {/* Main Profile Data */}
              <div className="w-2/3 p-6 bg-[#FFFFFF]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0C1A26]">Amara K.</h3>
                    <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A] mt-1 uppercase">LOC: LOS-NGA</p>
                  </div>
                  <div className="px-2 py-1 border border-[#B08A2E] flex items-center gap-1.5">
                    <BadgeCheck size={14} className="text-[#B08A2E]" />
                    <span className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold text-[#B08A2E] uppercase">Tier: Top 1%</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-xs mb-2">
                      <span className="text-[#5E6E7A] uppercase">Intl. Readiness (30% WT)</span>
                      <span className="text-[#0C1A26] font-semibold">96/100</span>
                    </div>
                    <div className="w-full bg-[#E3E8EB] h-1"><div className="bg-[#0C1A26] h-1" style={{ width: '96%' }}></div></div>
                  </div>

                  <div>
                    <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-xs mb-2">
                      <span className="text-[#5E6E7A] uppercase">Skills Match (25% WT)</span>
                      <span className="text-[#0C1A26] font-semibold">92/100</span>
                    </div>
                    <div className="w-full bg-[#E3E8EB] h-1"><div className="bg-[#0C1A26] h-1" style={{ width: '92%' }}></div></div>
                  </div>

                  <div>
                    <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-xs mb-2">
                      <span className="text-[#5E6E7A] uppercase">Growth Potential (20% WT)</span>
                      <span className="text-[#0C1A26] font-semibold">98/100</span>
                    </div>
                    <div className="w-full bg-[#E3E8EB] h-1"><div className="bg-[#0C1A26] h-1" style={{ width: '98%' }}></div></div>
                  </div>
                </div>

                <div className="mt-10 flex justify-between items-center border-t border-[#D7DEE3] pt-4">
                  <div className="font-['IBM_Plex_Mono',monospace] text-xs">
                    <span className="text-[#5E6E7A]">EXP_SALARY:</span> <span className="font-semibold text-[#0C1A26]">$40K-$50K</span>
                  </div>
                  <button className="bg-[#E3E8EB] text-[#0C1A26] px-4 py-2 text-sm font-medium hover:bg-[#D7DEE3] transition-colors flex items-center gap-2">
                    Action: Review <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ROI Calculator Section */}
      <section className="py-24 bg-[#0C1A26] text-[#EEF3F8]" id="roi">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#C2CCD4] uppercase tracking-wider mb-2">
                [ Module: Arbitrage_Calc ]
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-[#EEF3F8] leading-tight">
                Global quality. <br />
                <span className="text-[#C2CCD4] font-light">Asymmetric cost.</span>
              </h2>
              <p className="text-[#C2CCD4] text-lg leading-relaxed max-w-md pt-2">
                By bridging the purchasing power parity (PPP) gap, global employers unlock dramatic savings while offering African professionals 4x their local market salary.
              </p>

              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#EEF3F8] flex items-center justify-center text-[#0C1A26]"><Check size={14} strokeWidth={3} /></div>
                  <span className="text-[#EEF3F8] font-medium text-sm">Same skill level, verified by Telos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#EEF3F8] flex items-center justify-center text-[#0C1A26]"><Check size={14} strokeWidth={3} /></div>
                  <span className="text-[#EEF3F8] font-medium text-sm">Strong English/French (C1/C2)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#EEF3F8] flex items-center justify-center text-[#0C1A26]"><Check size={14} strokeWidth={3} /></div>
                  <span className="text-[#EEF3F8] font-medium text-sm">Excellent timezone overlap</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] text-[#0C1A26] border border-[#D7DEE3] shadow-md">
              <div className="p-4 bg-[#E3E8EB] border-b border-[#D7DEE3] flex justify-between items-center">
                <span className="font-['IBM_Plex_Mono',monospace] text-xs font-semibold text-[#0C1A26] uppercase tracking-wider">
                  ROLE: SR_FULL_STACK
                </span>
                <Calculator size={16} className="text-[#5E6E7A]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D7DEE3]">
                <div className="p-6 space-y-4">
                  <div className="font-['IBM_Plex_Mono',monospace] text-sm font-semibold text-[#5E6E7A] uppercase">
                    OPT_A: US-Based
                  </div>
                  <div className="space-y-3 font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A]">
                    <div className="flex justify-between"><span>Base_Salary</span> <span className="font-medium text-[#0C1A26]">$150,000</span></div>
                    <div className="flex justify-between"><span>Benefits</span> <span className="font-medium text-[#0C1A26]">$30,000</span></div>
                    <div className="flex justify-between"><span>Taxes_ER</span> <span className="font-medium text-[#0C1A26]">$15,000</span></div>
                  </div>
                  <div className="pt-4 border-t border-[#D7DEE3] flex justify-between items-center font-['IBM_Plex_Mono',monospace] font-semibold text-sm text-[#0C1A26]">
                    <span>TOTAL_A</span>
                    <span>$195,000/YR</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 bg-[#F2F4F7]">
                  <div className="font-['IBM_Plex_Mono',monospace] text-sm font-semibold text-[#0C1A26] uppercase border-b border-[#D7DEE3] pb-1 inline-block">
                    OPT_B: FUMANA
                  </div>
                  <div className="space-y-3 font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A]">
                    <div className="flex justify-between"><span>Base_Salary</span> <span className="font-medium text-[#0C1A26]">$45,000</span></div>
                    <div className="flex justify-between"><span>Platform_12%</span> <span className="font-medium text-[#0C1A26]">$5,400</span></div>
                    <div className="flex justify-between"><span>Payment_Proc</span> <span className="font-medium text-[#0C1A26]">$500</span></div>
                  </div>
                  <div className="pt-4 border-t border-[#D7DEE3] flex justify-between items-center font-['IBM_Plex_Mono',monospace] font-semibold text-sm text-[#0C1A26]">
                    <span>TOTAL_B</span>
                    <span>$50,900/YR</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#066E5A] p-5 flex justify-between items-center">
                <span className="font-['IBM_Plex_Mono',monospace] font-medium text-xs text-[#F4F7F8] uppercase tracking-wide">
                  NET_SAVINGS_COMPUTED
                </span>
                <span className="font-['IBM_Plex_Mono',monospace] text-2xl font-semibold text-[#F4F7F8]">
                  $144,100/YR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid System */}
      <section className="py-24 bg-[#F2F4F7] border-y border-[#D7DEE3]" id="assessment">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-[#0C1A26]">Intelligence architecture</h2>
            <p className="text-lg text-[#5E6E7A]">
              Moving beyond basic keywords. Our system evaluates, upskills, and matches professionals utilizing four distinct structural pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFFFFF] p-8 border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors">
              <div className="w-10 h-10 bg-[#E3E8EB] flex items-center justify-center mb-6 text-[#0C1A26]">
                <BrainCircuit size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#0C1A26] mb-3">Telos assessment</h3>
              <p className="text-[#5E6E7A] text-sm leading-relaxed mb-8">
                Standard tools fail to capture talent nuance. Telos performs zero-hallucination audits of technical history, cross-cultural competency, and remote infrastructure resilience.
              </p>

              <div className="bg-[#F2F4F7] p-4 border border-[#D7DEE3] space-y-3 font-['IBM_Plex_Mono',monospace]">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-[#5E6E7A] uppercase">Resilience Index</span>
                  <span className="text-[#0C1A26] font-semibold">91/100</span>
                </div>
                <div className="flex justify-between text-xs items-center border-t border-[#D7DEE3] pt-3">
                  <span className="text-[#5E6E7A] uppercase">Infrastructure Check</span>
                  <span className="text-[#A8431F] font-semibold flex items-center gap-1"><AlertTriangle size={12} /> 42/100</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-8 border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors" id="upskilling">
              <div className="w-10 h-10 bg-[#E3E8EB] flex items-center justify-center mb-6 text-[#0C1A26]">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#0C1A26] mb-3">Integrated upskilling ecosystem</h3>
              <p className="text-[#5E6E7A] text-sm leading-relaxed mb-8">
                Identify skills gaps via LMS learning paths. Candidates earn points and increase visibility profiles, tracked via metadata tiers.
              </p>

              <div className="flex gap-2">
                <div className="flex-1 bg-[#F2F4F7] border border-[#D7DEE3] py-2 text-center">
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#5E6E7A] uppercase">Bronze</span>
                </div>
                <div className="flex-1 bg-[#F2F4F7] border border-[#D7DEE3] py-2 text-center">
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#0C1A26] uppercase">Silver</span>
                </div>
                <div className="flex-1 bg-[#FFFFFF] border border-[#B08A2E] py-2 text-center">
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#B08A2E] font-bold uppercase">Gold</span>
                </div>
                <div className="flex-1 bg-[#FFFFFF] border border-[#B08A2E] py-2 text-center">
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#B08A2E] font-bold uppercase">Top 1%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-8 border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors" id="matching">
              <div className="w-10 h-10 bg-[#E3E8EB] flex items-center justify-center mb-6 text-[#0C1A26]">
                <LineChart size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#0C1A26] mb-3">Bidirectional accountability</h3>
              <p className="text-[#5E6E7A] text-sm leading-relaxed mb-8">
                We don't just score candidates; we rate employers. Enterprise partners are assessed on their "Africa Hiring Readiness" metrics.
              </p>

              <div className="bg-[#F2F4F7] border border-[#D7DEE3] p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-[#0C1A26] flex items-center justify-center"><Briefcase size={12} className="text-[#FFFFFF]" /></div>
                  <div className="text-sm font-semibold text-[#0C1A26]">Employer: Acme Corp</div>
                </div>
                <div className="font-['IBM_Plex_Mono',monospace] text-xs">
                  <div className="flex justify-between text-[#5E6E7A] mb-1 uppercase">
                    <span>Hiring Readiness</span>
                    <span className="text-[#0C1A26] font-semibold">88/100</span>
                  </div>
                  <div className="w-full bg-[#E3E8EB] h-1"><div className="bg-[#0C1A26] h-1" style={{ width: '88%' }}></div></div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-8 border border-[#D7DEE3] hover:border-[#C2CCD4] transition-colors">
              <div className="w-10 h-10 bg-[#E3E8EB] flex items-center justify-center mb-6 text-[#0C1A26]">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#0C1A26] mb-3">Micro-internships</h3>
              <p className="text-[#5E6E7A] text-sm leading-relaxed mb-6">
                Test talent before committing. Post 1-4 week project-based tasks. The Try Africa Talent module reduces enterprise risk.
              </p>

              <div className="bg-[#E3E8EB] border-l-4 border-[#0C1A26] p-4">
                <div className="font-['IBM_Plex_Mono',monospace] text-xs font-semibold text-[#0C1A26] uppercase mb-2">Initiative Logic:</div>
                <ul className="list-none text-sm text-[#0C1A26] space-y-2">
                  <li className="flex gap-2 items-start"><Check size={16} className="shrink-0 mt-0.5 text-[#5E6E7A]" /> First project module is 100% FREE.</li>
                  <li className="flex gap-2 items-start"><Check size={16} className="shrink-0 mt-0.5 text-[#5E6E7A]" /> Historical conversion to full-time at 40%+.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strict Footer Section */}
      <footer className="bg-[#FFFFFF] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#0C1A26]"></div>
                <span className="font-semibold text-lg text-[#0C1A26] tracking-tight">FUMANA</span>
              </div>
              <p className="text-[#5E6E7A] text-sm max-w-sm leading-relaxed">
                The Africa Talent Bridge. Connecting exceptional African technical professionals with the global remote economy through structural matching.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0C1A26] mb-4 text-sm">Enterprise</h4>
              <ul className="list-none space-y-3 text-sm font-['IBM_Plex_Sans',sans-serif]">
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">Post Requisition</a></li>
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">Micro-internships</a></li>
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">Global Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0C1A26] mb-4 text-sm">Builder node</h4>
              <ul className="list-none space-y-3 text-sm font-['IBM_Plex_Sans',sans-serif]">
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">Zuri Assessment</a></li>
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">LMS Access</a></li>
                <li><a href="#" className="text-[#5E6E7A] hover:text-[#0C1A26] transition-colors">Tier Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#D7DEE3] pt-8 text-center">
            <div className="font-['IBM_Plex_Mono',monospace] text-xs text-[#5E6E7A]">
              &copy; FIND Services Limited. Powered by Telos. Designed by Lexington Advisory Group.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
