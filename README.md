# FlipSight

A hands-free deal-sourcing HUD for Meta Ray-Ban smart glasses — built on the
**Meta Wearables platform** (Device Access Toolkit 1.0, Web Apps runtime).

One screen, one job: while you're out doing pickups, one glance shows the next
deal's numbers — ask vs. market, margin, distance, seller trust. Wrist gesture
(or arrow key, for now) advances the deck.

## Quickstart (no hardware needed)

1. Open `mock/preview.html` in a browser — the 600×600 frame simulates the
   Ray-Ban Display lens panel.
2. `←` / `→` (or swipe, or the on-screen buttons) to flip through deals.
3. Screen-record the frame for your demo video.

## Project layout

```
app/            The HUD web app (ships to the glasses Web Apps runtime)
  index.html    One screen: current deal
  styles.css    Glanceable design — 600×600, huge type, high contrast
  app.js        Deck logic + input (buttons/keys/swipe now, Neural Band next)
  deals-data.js Embedded deal data (generated from data/deals.json)
data/
  deals.json    Source of truth — scored flip deals (updated by morning scan)
  schema.md     Field reference (coming)
mock/
  preview.html  Browser-based lens simulator for demos + screen recording
docs/
  ARCHITECTURE.md  Design decisions, data flow, roadmap
```

## Data pipeline

`Flip Deal Scoreboard` (xlsx) → `data/deals.json` → `app/deals-data.js`

After refreshing `deals.json`, regenerate the embedded copy:

```sh
python3 -c "import json; d=json.load(open('data/deals.json')); \
open('app/deals-data.js','w').write('window.FLIPSIGHT_DEALS = '+json.dumps(d)+';')"
```

## 5-day build map

- **Days 1–2:** Create a free account on the Meta Wearables Developer Center,
  set up an org + project, read the Web Apps guides + API reference. Scaffold
  is already wired to live deal data.
- **Days 3–4:** Replace stub input with the runtime's Neural Band gesture API;
  sort by live phone GPS; persist last-viewed index in localStorage.
- **Day 5:** Record the demo (mock frame), publish this repo, write up the
  architecture. Portfolio: *"Built a Web App for Meta's AI glasses platform."*

## Wearables Developer Center checklist

- [ ] Developer account + organization created
- [ ] Project registered (Web App track)
- [ ] API reference reviewed: input/gestures, GPS, localStorage, lifecycle
- [ ] App tested against documented constraints (2-second glances, 600×600)
- [ ] Mock Device Kit pass (note: mock doesn't cover display glasses yet —
      lens testing needs hardware eventually)

## Roadmap

- **v1.1 — Deal check:** type an asking price, get an instant tier verdict
  against the scoring rubric.
- **v1.2 — Look-to-price:** photo capture → AI market estimate. (Needs the
  toolkit camera path for Web Apps — watch the changelog.)
- **v2 — Voice:** "Hey Meta, next deal" via the voice invocation work Meta
  has in progress.
