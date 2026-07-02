# FIND Premium Pro spec

Freemium gating. Basic is free. Premium unlocks priority matching, zero-commission escrow, and unlimited upskilling. Payment is stubbed at UI layer.

Powered by Telos. Designed by Lexington Advisory Group.

---

## Pricing

- Free tier: Basic profile, assessment, five upskilling modules, standard matching.
- FIND Premium Pro: $4.99/month. Priority enterprise matching, zero-commission escrow withdrawals (normally 12% platform fee waived on payouts), unlimited upskilling modules, the Negotiation Coach, the Global Worth Simulator, and the Trajectory Forecast.

---

## Implementation

NO MODEL. All gating is computed from the candidate's premium state in the shared store. No real payment logic.

Add to the candidate profile state:
```
isPremium: false,
premiumSince: null,
```

---

## Upgrade flow

A new "Premium" tile in Settings and Comm and a persistent banner on the Growth Dashboard for free-tier users.

The tile shows:
- Current plan: Free.
- What Premium unlocks: listed clearly.
- Price: $4.99/month.
- An "Upgrade to Premium" button.

On click: a modal. Shows the feature list and the price. A "Continue to payment" button. On click: a stubbed payment screen (card number, expiry, CVV fields, all clearly labelled "Sandbox. No real payment processed."). A "Complete upgrade" button that sets isPremium to true, records premiumSince, fires a toast "Welcome to FIND Premium Pro", and closes the modal.

A "Restore purchase" link for returning users, stubbed.

---

## Gating in the app

When isPremium is false:

- Negotiation Coach: show a locked state. "Available on FIND Premium Pro. Upgrade in Settings." A small brass lock icon on the nav item.
- Global Worth Simulator: same locked state.
- Trajectory Forecast: available to all (it is a core transparency tool, not a premium feature).
- Escrow withdrawals: the withdraw button in Wallet and Escrow shows "Zero-commission withdrawal: Premium only" with an upgrade prompt instead of the backend flag.
- Upskilling modules: the first three modules are free. The rest are locked with the same upgrade prompt.

When isPremium is true:

- All locks removed.
- The Wallet and Escrow withdraw button shows "Zero-commission withdrawal. Premium benefit."
- A "Premium" brass badge on the user chip in the sidebar.
- The dashboard shows a "Premium member since [date]" line under the tier badge.

---

## Settings display

In Settings and Comm, the Premium section shows:
- Free tier: current plan, upgrade button.
- Premium tier: "FIND Premium Pro. Active since [date]." A "Manage subscription" button (stubbed, toasts "Subscription management is a backend step."). A "Cancel subscription" link (stubbed, toasts same).

---

## Done when

- Free tier candidates see the locked state on gated features.
- The upgrade flow completes and sets isPremium in the shared store.
- All locks clear on premium.
- The brass Premium badge appears in the sidebar on upgrade.
- No real payment is processed. The sandbox label is prominent.
- vite build, tsc, oxlint clean.
