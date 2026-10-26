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
