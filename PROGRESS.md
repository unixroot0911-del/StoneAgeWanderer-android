# PROGRESS
- Project pushed unmodified; CI (.github/workflows/build.yml) builds debug APK via gradle 8.7 / JDK17.
- Local build impossible in sandbox (Google/Maven blocked); build runs on GitHub Actions.
- Auto-approve joins: Srv.java join handler now admits players immediately (no admin approval).
- game.html: LAN window now has Play + Load Save buttons and a tribe list with online/offline status (Net.known). Smoke-tested in headless Chromium.
- Guests auto-join; Play/Load Save only for host; host start/load broadcasts 'start' so guests enter simultaneously (world snapshot synced on load/late join).
- Fixed disconnects: host role was clobbered by broadcast 'joined'; guests never started net timers; fake 'b' from probes; auto-reconnect (netWsRecover); peer timeout 45s; keepalive + wifi lock.
- Added mapbook item (starting inventory + recipe) opening minimap (#mmap).
- Tested with headless Chromium + node ws relay (two clients). Java changes only compiled by CI.
- Next: test on real devices.
- Fauna update: source in dev/fauna_art.js + dev/fauna_sys.js; run `python3 dev/inject.py` to (re)inject into app/src/main/assets/game.html (idempotent, between /*FAUNA_BEGIN*/ and /*FAUNA_END*/ plus a few one-line source patches).
- Tested headless (Chromium): all species render, AI works, taming->ally->fights, XP/level, journal. Multiplayer mirror of new species verified.

## v3 Hardcore update (in progress)
- Plan in TASKS.md. Approach: new dev/v3.js block + source patches in dev/inject.py. Test via Playwright harness in /tmp/claude-0.

## v3 Hardcore update — DONE (built via dev/v3a.js, v3b.js, v3c.js; injected by dev/inject.py between /*V3_BEGIN*/ and /*V3_END*/)
- Always edit dev/*.js then run `python3 dev/inject.py` (idempotent; legacy patches warn+skip if already applied).
- Test: python3 /tmp/claude-0/mk.py builds test.html (exposes `__e(code)` = eval in game scope); node /tmp/claude-0/t3.js..t7.js (swim, temp/stations/map, shade, inventory).
- Decisions: S.warmth is now derived from core temp S.bt (warmth=(bt-32)/5*100). S.air breath, S.san sanity, S.inf infection, S.wet. Water depth `wdep(x,y)`; deep>0.85 = swimming. Shade is a client-only pseudo-object (not in ents, not synced).
- Known: loom placement failed in a test once due to blocked spot (not a bug). Multiplayer regression: both clients reach live state.

## v3.1: crafting ONLY at stations (dev/v3d.js). Inventory = read-only recipe guide; near a station the 'اصنع' action opens that station's recipes. Hand-only: rope, flint_blade, firewood, bench_kit.

## v3.2 stations rework (dev/v3d.js rebuilds REC fully)
- Hand (inventory) crafts: rope, flint_blade(minigame), bandage, torch, firewood(campfire kit) + ALL station kits. Everything else at stations.
- Stations: bench, carp, kiln, smelter, forge, grill, oven, smoker, tanner, loom, anvil(stone workshop), filter, lab, mill, farm, bed. Fuel stations (kiln/oven/smoker/smelter/forge/grill) take wood/charcoal; recipes with bg:1 run in background queue (s.q) and drop output beside station. Forge is manual with fuel.
- Ores drop from rocks (oreDrop); seeds from herbs; farm struct plants/harvests by season. Metal weapons map to draw kinds via wk().
- Audio: latencyHint playback, master .5, limiter-ish compressor, shorter reverb, voice limiter wrappers on N/O/F/R.
- Open question list for user: more stations/realism, water rendering, ice, chests.

## v3.3 (dev/v3e.js): station tools (hammer/saw/tongs/mortar from workbench), 13 new foods, water look (depth shade, ripples, shore foam), winter ice (shallow water freezes -> walkable). Frame errors show as console 'c:[game] frame error' in tests — check those.

## Auto-update support
- Fixed signing key app/saw.keystore (committed) + versionCode = 100 + GitHub run number, so each new APK installs OVER the previous one. APKs built before this commit were signed with random debug keys: uninstall the old one ONE time, after that updates install in place. NEVER change/delete the keystore or applicationId.
