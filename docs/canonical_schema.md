# Fumana canonical schema (demo and near-term build)

This is the one schema. It supersedes the competing drafts for MVP scope. Where the older specs disagree, this document wins. It is scoped to the four-beat demo plus the entities the immediate build needs, not the entire long-term platform.

Powered by Telos. Designed by Lexington Advisory Group.

---

## The decision that kills the ambiguity

Your existing specs split on the database. Two backend documents build Telos on a Neo4j knowledge graph. The product architecture document names MongoDB as the primary store. They also use different names for the same things.

Resolution:

- **Operational data lives in a document store.** Builders, employers, roles, matches, engagements, the SROI ledger, and agent runs. This is what the demo and the near-term build read and write.
- **The CCM is a conceptual reasoning graph, realized later.** When the Bayesian engine is built, the graph is projected from the operational store. Until then, the match score is computed by the demo as a seeded value. No Neo4j is required to ship the demo.
- **One name per thing.** A mapping table at the end translates every older name to the canonical one, so nothing from the old specs is lost.

Two markers used below: **PII** means masked until an employer commits. **Computed** means the value is calculated in code, never produced by a language model.

---

## Canonical entities

### Builder
The talent. Older specs call this Candidate or ExpertBuilder.
```
id                string
maskedHandle      string        // shown to employers, e.g. "0xA7"
name              string  PII
city              string  PII
country           string
role              string        // e.g. "Backend engineer"
tier              string        // visibility tier
profileStrength   number        // 0 to 100, Computed
pppMultiplier     number        // Computed
rewardPoints      number
skills            [SkillRef]
outcomes          [Outcome]     // produced by the Experience Alchemist
integrityNote     string        // produced by the Experience Alchemist
```

### Outcome
A recruiter-ready claim with its source, from the Experience Alchemist.
```
statement   string
basis       string   // the part of the raw account it came from
```

### Skill
```
id            string
name          string
domain        string
marketDemand  number
```
`SkillRef` on a Builder carries `{ skillId, strength, verifiedDate }`.

### ImpactEvidence
Backs a skill or an impact claim.
```
id               string
type             string
sourceRef        string     // link or artifact reference
validated        boolean
auditScore       number     // Computed
```

### Employer
```
id            string
name          string
city          string
country       string
ssoProvider   string        // OIDC or SAML identity provider
```

### Role
An employer requirement. Older specs call this EMPLOYER_ROLE.
```
id              string
employerId      string
title           string
need            string
requiredSkills  [string]      // skill ids
timezone        string
baseSalaryUsd   number
esgQuota        string
```

### Match
Links a Builder to a Role. The output of the CCM.
```
id            string
builderId     string
roleId        string
confidence    number        // 0 to 1, Computed by the CCM, seeded in the demo
factors       [Factor]      // the causal factors behind the score
status        string        // shortlisted, interviewing, sow_pending
```

### Factor
```
label   string
weight  number   // contribution to the score
```

### Engagement
The contract. Holds the Statement of Work. The SOW fields come from the Compliance agent.
```
id              string
matchId         string
jurisdictionId  string
monthlyUsd      number
title           string
scope           [string]
deliverables    [string]
ipClause        string
eorNote         string        // references that remittance is handled, no rates asserted
term            string
status          string        // draft, active, closed
```

### Jurisdiction
Local context. Holds references to local statutory obligations without asserting specific rates, which require professional verification.
```
id              string
country         string
currencyCode    string
statutoryNotes  string        // general references, no hardcoded rates
```

### FxRate
```
basePair        string        // e.g. "USD/NGN"
rate            number
asOf            datetime
illustrative    boolean       // true for seeded demo rates
```

### SROIEntry
The EESG ledger row. Every figure is computed and stored with the inputs that produced it, so the derivation is always inspectable.
```
id              string
engagementId    string
grossUsd        number        // Computed
fxRate          number
grossLocal      number        // Computed: grossUsd * fxRate
retentionPct    number        // assumption, stored explicitly
retainedLocal   number        // Computed: grossLocal * retentionPct
sdgTags         [string]      // e.g. SDG 8, SDG 9, SDG 17
computedAt      datetime
```

### AgentRun
An audit record of every language-layer call. This is how Telos stays accountable.
```
id          string
agent       string        // alchemist, zuri, sow, rederivation
inputRef    string
outputJson  object
model       string         // claude-sonnet-4-6
createdAt   datetime
```

---

## The CCM reasoning graph (conceptual layer)

When the Bayesian engine is built, these entities project into a graph. This is the model, not a separate database for the demo.

Nodes: Builder, Skill, Role, ImpactEvidence, ExternalFactor, InfrastructureAdvance.

Edges:
```
(Builder)-[:POSSESSES {strength, verifiedDate}]->(Skill)
(ImpactEvidence)-[:VERIFIES {auditScore}]->(Skill)
(Role)-[:REQUIRES {mandatory}]->(Skill)
(ExternalFactor)-[:INHIBITS {probabilityDrop}]->(Builder)
(InfrastructureAdvance)-[:MITIGATES]->(ExternalFactor)
```
`ExternalFactor` carries signals such as power grid status and network latency. `InfrastructureAdvance` is the Starlink or solar unlock that mitigates them. The demo does not implement this graph. It is here so the build does not lose the model.

---

## Name mapping, old specs to canonical

| Older name | Canonical |
| --- | --- |
| CANDIDATE, ExpertBuilder | Builder |
| EMPLOYER_ROLE | Role |
| Employer | Employer |
| Artifact, IMPACT_EVIDENCE | ImpactEvidence |
| Project, SOW_Template | Engagement |
| Jurisdiction | Jurisdiction |
| FXCorridor, FX rate | FxRate |
| SROI figures | SROIEntry |
| Zuri output, agent output | AgentRun |

---

## What the demo actually persists

For the four-beat demo, only these are live: Builder with Outcomes and integrityNote, Role, Match with Factors and seeded confidence, Engagement with the generated SOW, and SROIEntry with computed figures. Everything else is defined here so the engineers build against one model from the first commit.
