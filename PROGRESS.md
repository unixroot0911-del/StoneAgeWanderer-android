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
