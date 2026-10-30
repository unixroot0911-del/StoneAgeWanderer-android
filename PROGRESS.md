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

## v3.4 stealth (dev/v3f.js): stances (button #stBtn / keys C,Z): stand/sit(crouch)/crawl; player noise (SN.noise), cover, wind-based smell; animals have awareness (e.aw / e.noticed) via SENS table, un-noticed animals run AI with P temporarily offset (hack in updEnt wrapper); '?'/'!' icons; sneak attack x1.6/x2.4; stat bars show numbers + danger levels + screen/sound cues.

## v3.5 (tracks/pose/sound)
- v3g.js added to inject.py list. Pose: pk1/pk2 eased, modifies P.rig after updPlayer. Tracks: TKS array (not TK, which exists), foot every .9/1.7/2.8 units by stance, blood while S.bleed; life shrinks with rain, grows with snow. Predators (TRK) follow when not noticed: trkTarget returns fake P 7 units ahead toward next track. Sounds in updEnt wrapper.
- Tested headless (t12.js): poses OK, trail made, wolf followed. Unverified on device: audio balance.
- Next ideas: edge arrows for offscreen threats, animals leaving tracks for player to read, peer rig poses in multiplayer.

## v3.6
- Crawl removed (stance 0/1 only; pose code for crawl remains inert). Top HUD readouts hidden (temp/sanity/stealth pill/season name/season banner); replaced by symptom toasts + breath fog (v3g `hint()`). Air bar kept.
- Lag: adaptive LITE mode (v3g, fAvg of frame time) skips water wave FX and track drawing on slow devices. Unverified on device.

## v3.7
- Replaced symptom toasts with real FX+sounds in v3g.js: cold (camera shiver, body tremor, teeth chatter, breath fog), heat (panting, sweat drops), wet drips, low sanity (tinnitus, phantom footsteps, black flicker), season ambience (winter wind gusts, autumn leaf rustle, summer cicadas). Verified only headlessly; audio levels need device feedback.

## v3.8
- FIX: hurtEnt wrapper in v3f.js dropped `e` arg → player could not damage anything since v3.4. Fixed.
- "!" marker now only for animals that noticed the player or flee within 22 units; "?" removed.
- Lag: sim radius cut (QUAL ents 70, aiRange 30, wildMax 45, spawn ring 22-34, chunk loop ±4, despawn 48). Patched in inject.py.
- Open: wolf trail-following less consistent in headless test after radius change (st idle) — recheck.

## v3.9
- Recipes: inventory guide shows only hand recipes with at least one owned ingredient; station panels same rule (recPart in v3d.js). Firewood now log+axe -> 3.
- NEW dev/v3h.js: custom weapon carving workshop (button in carp/forge panel). Grid 48x80 of materials, drag items in, tools knife/saw/hammer (metal needs hot forge + tongs), rope binding of mixed-material joints, stats from shape (cwAnalyze), saved in S.cust (hex string), rebuilt on load (restoreSnapshot wrapper), held sprite via cwDrawHand (inject patch in drawPlayer), swing speed via WEAP.spd.
- Tested headlessly (t16/t17). Needs device test: touch dragging, layout on small phones.

## v3.10
- Scroll fix: touchmove blocker now allows any scrollable ancestor; .panel overflow-y:auto; custom-craft lists pan-y.
- Stacks: STK map in inject.py (log 4, stone 6, stick 12 ... kits 2, default 8).
- Dropped items (manual drop) can't be picked for random 5-10 s (drop.nl).
- Camera rotation removed (drag horizontal, pinch twist, Q/E, saved/loaded angle forced 0); tilt+zoom kept. ZMIN .72->.85; grass LOD (k===0 objects beyond ~10-14 units skipped when zoomed out or LITE).

## v3.11
- Bigger stacks (STK in inject.py, default 12, kits 3) + dev/v3i.js: bundles (pk_<id>, BUN map, rope cost for wood things, 8 bundles/slot, pack/unpack buttons in #info) and carry weight (WTK kg, capacity 45 +3/extra slot, over-capacity slows via spdMul wrapper, shown in inventory header).
- inject.py: dedupe of LOD patches (rep isn't idempotent when old text is substring of new).

## v3.12
- dev/v3j.js: cinematic boot splash (#v3boot, canvas art v3art: moon, ridges, mammoth, fire, wanderer; logo reveal; tap to start + title sting), menu buttons stagger in after tap, loading screen (#v3load) wrapping loadFinish (async w/ paint, min ~2s, tips), gameplay HUD hidden on main menu (body.inmenu). inject.py rep() made idempotent.

## v3.13
- Main menu now has the live art (v3art mode 'menu', canvas #v3mbg) behind it; boot/loading timings shortened (boot tap after .35s, loading min ~1.1s).
- Camera: vertical tilt removed (elev fixed ELDEF); horizontal drag rotation + Q/E restored; pinch zoom kept (pinch twist stays off).

## v3.13b
- Fix: boot tap did nothing on device — v3tick() ran synchronously during script load and could throw (zero-size canvas / NaN gradient), aborting v3j before listeners attached. Now tick is try/catch'd, started at end of file, and tap is bound on boot overlay (pointer/touch/click) plus document capture.

## v3.14
- Removed the "!" marker over animals (drawEnt wrapper deleted from v3f).
- dev/v3k.js: living bars (the original width writes hit the svg path, so bars never moved - now written to <b>): ghost trail, hit/gain flash, pulse+glow when low, trend arrows, recent-damage counter, threat chip (hostiles that noticed you) + alarm horn, red screen-edge pulse <28 hp. Heartbeat starts below 45 hp.
- Balance: player damage x1.05 (was 1.15), i-frames .75s (was .55).

## v3.15
- dev/v3l.js: all on-screen alert/hint text silenced (sound/FX only). Poison reworked: dmg .65/s, green HP toxin segment, screen tint/wobble, retching; cures: antidote full, charcoal -14s (works at full hunger), herb -6s, clean water -3s.
- Handbook "كتيّب المسافر" via #qbtn: open pages (start, bag, craft w/ known recipes, food, body) + discoverable pages (S.dis flags), chime+glow on unlock.
- Tested headless (t24.js): no toasts, charcoal cures, book opens. Not verified on device.

## v3.16/v3.17
- v3.16: station craft bug fixed (closeInv cleared recStn before startCraft; stnKeep in v3d.js). Hidden #s-warm/#s-energy bars + craft label.
- v3.17 (dev/v3m.js, Srv.java /info):
  * Temperature & sleep removed (S.bt/energy/warmth forced, startSleep noop).
  * Saves: snapshot used to be ~2MB (all chunks) -> localStorage quota failed on 3rd slot. Now `wm` delta (WMOD map, applied in getChunk wrapper, stashed on chunk eviction). ~10KB.
  * MP rebuilt: root bug = guests ran `hi` on OTHER phone's server and became admin there (two admins). Now each phone hosts on own server (ws://127.0.0.1:8787, `hi`), guests `join` remote server. Auto-open room whenever a world is live (toggle in panel, localStorage saw-open). LAN scan fetches http://ip:8787/info over own /24 (Android.ip()). Panel #mpx (main menu button #netBtn, pause menu #mxPauseBtn, roster button). Host sends 'W' (world delta+structs+fires+drops+clock) to joiner / after loading a save; guest does newGame+apply+spawn near host (autosaves own world to slot 3 first).
  * Wildlife mirror bug fixed (guest recreated every animal each push because nid not copied) + interpolation; guest hits relayed ('H'), host AI targets nearest player and relays damage ('D'); single 20Hz position timer (old code duplicated pushes); no-peer send gating; peer first-sample snap.
  * Removed peer hint texts, #netFeed/#netBar hidden.
  * Tests: /tmp/claude-0/t29.js, t30.js (2 browsers). Known limits: animals only exist within ~48 of the HOST (guests far from host see none); old rtc/code UI still in game.html but unreachable.

## v3.18
- MP: wildlife spawn/despawn/AI around every player (mxFarAll/mxNearAny patched into manageEnts via inject rep; peer spawn via swapped P in manageEnts wrapper). Guest keeps own inventory/stats when joining. Death->down state verified with 2 browsers (t31.js).
- dev/v3n.js: storage chest (chest_kit, plank5+rope2 at bench; struct.box map; modal #cbox; MP sync msg 'cx'; saved with structs), fishing rod (fishing_rod: stick2+rope1+bone1, inventory "ضع" -> mxFishStart: wait job then startMG catch -> raw_fish; needs water within 1.75), volume slider in pause menu (localStorage saw-vol, master.gain), minigame texts hidden.
- Test: /tmp/claude-0/t32.js. Remaining ideas: ice on lakes, water shimmer, clothing slots, difficulty tuning from user feedback.

## v3.19
- dev/v3o.js: frozen lakes in winter (iceK ramps in seas 3 from ~day 19.2 of year; wdep wrapper returns 0 when iceK>.7 so you walk on ice; tile overlay via inject rep in drawGround), water shimmer streaks (skipped in LITE). Test t33.js.

## v3.20
- dev/v3p.js: head/feet gear (hide_cap -12% dmg, hide_boots +5% speed & 70% chance to ignore snake poison). Recipes at bench w/ needle. Equipped icons shown under bars (#gearRow, tap to unequip). S.gear saved in S. No on-body drawing yet. Stance label text removed. Test t34.js.

## v3.21 — hunter tribe + night dread (dev/v3q.js)
- AN.hunter (hp44), camps ~2.6% of chunks >130 from spawn, stored in S.camps[key]={x,y,left,clr,raid}; fire(camp:1)+2 shelters(camp:1); spawned via populate wrapper (admin/solo only). Respawn 2 hunters 4 days after wipe.
- AI.hunter modes (e.mode): camp (patrol, role0 sleeps at night), watch (circle 8-13, 6-12s), hunt (melee flank / role1 spear thrower via arrows{enemy:1}), flee (<30% hp), raid (night, torch, approach). Detection radius 22 day/15 night scaled by player speed. hurtEnt on a hunter alerts camp.
- Raids: night>.6, day>=3, player has lit fire within 14 or torch, camp 50-95 away, 50%/6s check -> 2 raiders spawn 27-29 from player (AI range is 30!) toward camp direction.
- Sounds: SFX.drum (camp drums at night within 80, faster during raid), hcall, snap (random branch snap at night). Torch lights via netLights wrapper; DR.hunter draws torch at night.
- Balance: melee 12 dmg/2.5s, spear 11 dmg/5-7.5s. Tests t35-t38.js. Not synced for MP: torch flags (guest computes from night), modes.

## v3.22 — ancestors' tablets + far altar (dev/v3r.js)
- S.altar random 650-900 from spawn per world; S.tab (read tablets), S.tsites (placed registry), S.altarDone. Tablets (struct kind 'tablet', camp:1 flag exempt from caps) placed once per generated chunk (1.4%, >70 from spawn) via getChunk wrapper; altar struct placed when its chunk generates.
- Reading a tablet writes a hint into handbook chapter 'tablets' (dyn hbTablets): coarse direction (1-2 read), 8-dir + travel time (3-4), exact distance (5+). Bearing: N = -y.
- Altar: needs lit torch (S.torchT>0) -> permanent fire, win overlay with custom text, S.won=1. Test t39.js.

## v3.23 — base defense (dev/v3s.js)
- wall_kit (2 plank+1 rope @bench → x2): wall stake struct, r=.6, hp 70, blocks ground ents (moveEnt wrapper) and player (struct r>0). Hunters in hunt/raid chop walls within 1.35 (9 dmg/1.3s). Single wall is a circle—ents slide around; need lines of walls.
- spikes_kit (6 stick+1 rope, hand): trap, r=0, hp 14, every .7s hurts non-flying ents within .75 for 8 (1 hp wear).
- Walls/spikes flagged camp:1 (exempt from struct cap); remote adds (s+) get hp lazily via update wrapper.
- Test: /tmp/claude-0/t40.js,t41.js. Next: feedback tuning; wall repair; caves/ruins; MP sync of wall hp (not synced).
- v3.24: hide cap drawn on player head (v3s.js end).

## v3.25 — ruins/caches (dev/v3t.js)
- Boredom fix: exploration rewards. struct kind 'cache' (bone pile / cairn / hide bundle), ~4% of chunks >45 from spawn (admin only), S.csites map; interact → loot by distance tier (0<160, 1<420, 2 beyond: bronze/iron gear), +XP, 22% wolf ambush (day>=2). Test /tmp/claude-0/t44.js.
- Ideas next: guarded caches (hunters), caves, smoke on horizon, more varied events.

## v3.26 — cave start (dev/v3u.js)
- newGame → caveBuild(): S.cave={x,y,a,L:34}; chamber (ring of 'rockw' boulders r=1, 2 rows) + winding 34-unit tunnel; objs inside hidden (o.hide, cut, cutAt 1e12) via getChunk wrapper caveClear; ents purged from cave; starter drops (sticks, fiber, resin, flint, tinder, stone, bone).
- Darkness: render wrapper (multiply tint + radial gradient; torch/lit fire enlarges light); wake-up blackout 5.5s, speed x0.4 for 5s, heartbeat, drips. dk fades to 0 toward tunnel exit.
- moveEnt blocks ents with wall+rockw. Removed dup cache cand rep. Test: /tmp/claude-0/t45.js.
- Note: user says boredom "in all moments" — consider more moment-to-moment loop (events, combat feel).

## v3.27 — audit fixes + ambient events (dev/v3v.js)
- Audit: bot died to wolves just outside cave exit (safe spawn zone was 38 < tunnel 34+) → inject rep: safe zone 85 / age<420 when S.cave. Recipes audited (all items/icons/sources exist). Save roundtrip with cave OK (~106KB snapshot).
- Events (S.age>240, every 110–240s, not in cave/sleep): tremor (shake+rumble+falling stones), stampede (deer/boar herd runs past, trample 10 dmg; AI.deer/boar e.stamp), meteors at night; during rain lightning flash + delayed thunder. NOTE: using dist() inside AI wrapper gave wrong values once (unexplained) — avoided.
- Test: /tmp/claude-0/t49.js.

## v3.28 — realistic cave rewrite (dev/v3u.js replaced)
- No more boulder structs. Cave = massif (S.cave.m discs) minus carved floor (S.cave.d discs): ~40-node winding main passage (2.1 spacing) + 3 branches ending in chambers (cache loot) + skylight + mouth (last 2 discs outside massif). Stored in S.cave {d,m,deco,ends,mouth,sky,bb,id}.
- Rendering: drawGround wrapper cvLayer(): offscreen rock face + top (shifted up by CV_WH) + floor pattern; render wrapper cvLight(): darkness mask with destination-out lights (player glow, torch, lit fires, daylight chain from mouth, skylight). Inside → ceiling darkened.
- Collision: caveBlocked(x,y) = inM && !inD; update/moveEnt wrappers revert axes. Safe spawn zone 135.
- Verified BFS connectivity (mouth + all branch ends) on 6 seeds. Tests: t51.js (screens), t52.js (connectivity).

## v3.29 — cave bear, carcass+vultures, wolf stalking, combat juice (dev/v3w.js)
- KEY FINDING: v3f 'senseEnt' fakes P at +5000 for SENS species (bear/wolf/...) until e.noticed — any custom AI wrapper using P/dist sees a far player. Set e.noticed=1 for custom-AI ents (done for cave bear, stalkers). (Explains the earlier unexplained dist()=7043.)
- Cave bear sleeps in branch chamber ends[2] (lazy spawn <40 units, culled when far), wakes by noise (run 11, walk 6, crouch 3), snore SFX cue, better cache (tier1) there.
- Carcass event (cache v=3 ribcage, carc:1, tier1+meat): spawns 34–50 from player every ~4–7 min (max 2), circling vulture silhouettes drawn above, caw SFX within 55; guards spawn on approach (40% 2 wolves, 20% sabertooth day>=3).
- Wolf stalking at dusk event (3–4 wolves circle at 14 units ~25s, howls, then attack; flee from torch/fire).
- Combat: hit-stop (update dt*.08 for 30–100ms), shake, blood burst on kill, red vignette on player hit.
- Interaction range for structs is 2.4. Test t53.js.
