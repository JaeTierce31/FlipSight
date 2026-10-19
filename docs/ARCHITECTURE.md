# FlipSight — Architecture

## The bet

Smart-glasses displays are for **glanceable information, not sessions**.
Meta's own guidance and third-party builders converge: one screen, one job,
2-second reads, coarse input, phone stays the brain. FlipSight is designed
inside those constraints instead of fighting them.

## Why the Web Apps path (not the native SDK)

- The Wearables Device Access Toolkit's native route needs Swift/Kotlin and a
  companion mobile app. The **Web Apps runtime** runs plain HTML/CSS/JS
  directly on the glasses — no companion app, no new language.
- Our team's strength is TypeScript/JavaScript. This path turns the glasses
  into a deployment target for skills we already have.
- Trade-off accepted: Web Apps get motion/orientation, phone GPS, Neural Band
  input, and localStorage — but not (yet) the raw camera stream the native
  SDK exposes. v1.2's look-to-price feature waits on that.

## Data flow

```
Morning Marketplace scan (cron)
        │  scores: discount 40% · demand 25% · condition 15% · hassle 10% · trust 10%
        ▼
Flip Deal Scoreboard (xlsx — human-readable, sortable)
        │  export
        ▼
data/deals.json  (source of truth for the app)
        │  embed (build step, see README)
        ▼
app/deals-data.js → app.js renders the deck, best score first
```

The HUD never computes prices — scoring stays in the pipeline, where it's
auditable. The glasses show outcomes.

## Interaction model

| Now (v1)            | Wearables runtime (Day 3–4)      |
|---------------------|----------------------------------|
| Buttons             | Neural Band gesture → next/prev  |
| Arrow keys          | Same mapping                      |
| Touch swipe         | Same mapping                      |
| Static distance     | Live phone GPS → re-sort by `distance_mi` |
| Session state lost  | localStorage → resume deck position |

Input must stay coarse and forgiving — a wrist flick, not a tap target.

## Visual design

- Fixed 600×600 canvas (Ray-Ban Display lens panel).
- Black background, white type, one accent color per tier
  (green GOOD DEAL / yellow DEAL / red BAD DEAL).
- Ask price at 64px — the single most important number is the biggest.
- Title clamped to 3 lines; nothing scrolls. If it doesn't fit in a glance,
  it's cut.

## Privacy

- Only public Marketplace listing data (titles, prices, locations sellers
  chose to publish). No accounts, no messages, no PII beyond what's on the
  listing itself.
- No analytics, no tracking in v1. If added later, it stays on-device.

## What "done" looks like

A 60-second demo video: lens frame advancing through 5 deals hands-free,
captioned with what each glance is for. That video + this repo + the
write-up is the portfolio artifact — and the interview story:
*"I build on Meta's platform."*
