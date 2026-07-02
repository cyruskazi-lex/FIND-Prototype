# Culture Shock Simulator spec

A proper interactive training screen inside Path to 1%. Not a placeholder module. Gamified scenarios that train candidates on Western corporate communication norms.

Powered by Telos. Designed by Lexington Advisory Group.

---

## What this is

Interactive, scenario-based training. The candidate reads a realistic workplace situation and chooses how to respond. Telos scores the choice and explains the Western corporate expectation versus the common African professional instinct, without framing either as wrong. The goal is closing the communication gap before the interview, not after.

NEEDS MODEL. Routes through /api/claude. Inert-aware when no provider is set.

---

## Location

A dedicated tab inside Path to 1% alongside "Training" and "Micro-internships." Label: "Culture Shock Simulator."

---

## Scenarios (seed five, adaptive later via the same getScenarios() seam as getQuestions())

```
[
  {
    id: "cs-001",
    title: "The blunt message",
    situation: "Your manager in Berlin sends a Slack message at 9pm your time: 'This is not what I asked for. Redo it.' You spent three days on this work.",
    options: [
      "Wait until tomorrow and redo it without responding.",
      "Reply immediately: 'I apologize. I will redo it right away.'",
      "Reply: 'Understood. Can you point me to what needs to change so I get it right this time?'",
      "Reply: 'I worked hard on this. Could you tell me specifically what is wrong?'"
    ],
    correct: 2,
    explanation: "Option C is correct. In Western enterprise contexts, asking for specific feedback is professional, not defensive. It shows you want to solve the problem, not just comply. Option A is passive and reads as avoidance. Option B over-apologizes without gathering information to improve. Option D sounds defensive about effort rather than focused on outcome."
  },
  {
    id: "cs-002",
    title: "The silent deadline",
    situation: "A US client gave you a task on Monday with no deadline. It is now Thursday. You are 80% done but need two more days.",
    options: [
      "Finish it before reaching out. Deliver on Saturday.",
      "Send a message now: 'Update: I am 80% done. I need two more days, delivering Saturday. Blocking issue: [X]. Need anything from you before then?'",
      "Wait until Friday to send an update.",
      "Ask your manager what the deadline was before doing anything else."
    ],
    correct: 1,
    explanation: "Option B is correct. Proactive async updates are the single most valued behavior in Western remote teams. Do not wait to be asked. State progress, state the new date, name any blocker. Option A delivers without communication, which creates anxiety for the client. Options C and D are too late or too passive."
  },
  {
    id: "cs-003",
    title: "Disagreeing with a senior",
    situation: "Your tech lead proposes an architecture you believe will cause scaling problems in six months. You are the most junior person on the call.",
    options: [
      "Stay quiet. It is not your place to challenge a senior.",
      "Challenge them directly in the meeting: 'That will not scale.'",
      "After the meeting, send a private message with your concern and your alternative.",
      "Raise it in the meeting: 'I want to flag a potential scaling concern. Can I share a quick alternative for the team to consider?'"
    ],
    correct: 3,
    explanation: "Option D is correct. Western enterprise values technical input regardless of seniority, but framing matters. Asking permission to share ('can I...') shows respect for the meeting flow. Naming it a 'concern' rather than a verdict keeps it collaborative. Option A wastes your knowledge. Option B is abrupt. Option C is good but private, which misses the team benefit."
  },
  {
    id: "cs-004",
    title: "The unclear requirement",
    situation: "You receive a task with a two-day deadline. The requirements are ambiguous in two key areas. Your tech lead is in a different timezone and offline for the next eight hours.",
    options: [
      "Wait for them to come online before starting.",
      "Make your best assumptions, document them, start work, and send a message outlining your assumptions and asking for confirmation when they are back.",
      "Start work on the parts that are clear and ignore the ambiguous sections.",
      "Email the client directly to clarify."
    ],
    correct: 1,
    explanation: "Option B is correct. Document your assumptions and proceed. This is the core async muscle. You keep the project moving, you show initiative, and you create a clear record. Option A stalls the work unnecessarily. Option C creates a partial deliverable with hidden gaps. Option D bypasses the chain of communication."
  },
  {
    id: "cs-005",
    title: "The critical code review",
    situation: "A senior colleague leaves twelve comments on your pull request. Three are blocking. The tone is terse and technical, no praise.",
    options: [
      "Feel discouraged. A good PR would have fewer comments.",
      "Address the three blocking comments and mark the others as 'will fix later.'",
      "Address every comment, reply to each one explaining what you changed or why you disagree, and re-request review.",
      "Ask your manager if the feedback was fair before responding."
    ],
    correct: 2,
    explanation: "Option C is correct. Thorough engagement with every review comment, including explaining your reasoning when you disagree, is the mark of a senior engineering culture. Terse review comments are normal, not hostile. Option A misreads the culture. Option B leaves unresolved items. Option D escalates unnecessarily."
  }
]
```

---

## Interaction flow

On entering the tab, show a brief intro: "Five scenarios. Real workplace situations. Choose how you respond. Telos explains the reasoning behind each answer."

Show scenarios one at a time. For each:
- The situation, displayed as a realistic message or event, not a test question.
- Four options as selectable tiles.
- On selection: reveal whether it is correct. Show the explanation. Score: correct gets 20 points, incorrect gets 0 but shows the full explanation.
- A "Next scenario" button.

After all five: a completion summary. Total score out of 100. A plain one-line read from Telos: generated via /api/claude with the system prompt below. Award 300 Good Citizen Points on completion. Log to audit trail.

Completion call to Claude:
```
System: "You are Telos, assessing a builder's Western corporate communication readiness. In two sentences, give a direct, honest read of their performance across these five scenarios. Name their strongest instinct and the one area to sharpen. No flattery. No em dashes."

User: "Score: [X]/100. Scenario results: [list of correct/incorrect per scenario]."
```

Inert-aware: if no provider, show a static completion message instead of the Telos read.

---

## Points and profile

On completion: +300 Good Citizen Points. A "Culture Shock Simulator" completion badge on the candidate Profile screen. The badge shows the score (e.g. "85/100") next to it.

If the candidate scores below 60: show a prompt "Retake to improve your score. Your best score is recorded." Allow unlimited retakes. Record the best score only.

---

## Done when

- Five scenarios render and score correctly.
- The Telos completion read fires on provider set, inert-aware when not.
- 300 points awarded on first completion.
- Badge appears on Profile.
- Best score recorded on retake.
- vite build, tsc, oxlint clean.
