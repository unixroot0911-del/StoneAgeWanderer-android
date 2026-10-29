# v3.27 done: events+audit. Next: feedback; more events (carcass+vultures, wolf stalking), combat feel
# v3.21 done: hunter tribe + night dread. Next: tune from user feedback; maybe caves/ruins, story goal
# v3.20 done: gear slots. Next: wait for user feedback (difficulty tuning)
# v3.19 done: ice + shimmer. Next: clothing slots, difficulty tuning from user feedback
# v3.18 done: peer wildlife, chest, fishing rod, volume. Next: ice, water shimmer, clothing slots
# TASKS (priority order) — v3.17 in progress
1. [ ] Remove body-temperature & sleep mechanics (bars already hidden) -> v3m.js
2. [ ] Saves: snapshot was ~2MB (all chunks) -> localStorage quota fails on 3rd save. Delta-save only changed objects (WMOD), apply on chunk gen.
3. [ ] Multiplayer rebuild (v3m.js): each phone hosts on its OWN server (127.0.0.1:8787); guests join remote server via {t:'join'} (never 'hi'); old code made guests admins of other phones' servers.
   - /info endpoint in Srv.java, subnet scan (fetch /info) -> rooms list, no invitation needed (server auto-accepts)
   - auto-open room when a world is live (toggle in panel), world transfer 'W' to joiners (+ re-push after host loads save)
   - single timer set (old code duplicated pushes), peer first-sample snap, entity interpolation, no-peer send gating
   - new panel #mpx (rooms, my room toggle, players, manual IP), button in pause menu + roster
4. [ ] Remove peer on-canvas hint texts, hide #netFeed
5. [ ] Tests: two-page playwright t29.js (host/guest world transfer, save, load-then-host), build, ship v3.17

- [x] v3.15 silence texts, poison rework, handbook (done)
# TASKS
## Done in v3 "Hardcore" (commit after 7db0a14)
Swim/drown (player+animals, depth based), quests/tutorial removed, new cached minimap (explored-only, tap = bigger/close), body temperature in °C + wet/wind/fire/shelter, seasonal temperature curve + day length + hibernation + events (heat/cold waves), slow regrowth (trees 50min, rocks 80min, fauna chunks 25min, bushes by season), 8 crafting stations + 25 recipes + inventory "made from/used in" + sort, sanity + shade stalker + fog + hallucinations, infection.
## Next
1. Real-device testing by user; tune difficulty (swim stamina, shade frequency, temperature).
2. Water tile rendering is still flat blocky diamonds — could add shimmer/shoreline foam.
3. Ice on frozen lakes in winter; fishing rod; chest storage; more clothing slots.
4. Guests in multiplayer: shade/sanity are local-only by design.

## Done v3.5
- [x] Real sit/crouch + crawl pose (dev/v3g.js pose wrapper on updPlayer)
- [x] Positional animal footsteps/rustle/distant howl-roar (spat)
- [x] Tracks (TKS) + blood trail; wolf/bear/sabertooth follow them (trkTarget, fake-P trick in v3f updEnt)
