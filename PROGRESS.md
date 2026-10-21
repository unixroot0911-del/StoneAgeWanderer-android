# PROGRESS
- Project pushed unmodified; CI (.github/workflows/build.yml) builds debug APK via gradle 8.7 / JDK17.
- Local build impossible in sandbox (Google/Maven blocked); build runs on GitHub Actions.
- Auto-approve joins: Srv.java join handler now admits players immediately (no admin approval).
- game.html: LAN window now has Play + Load Save buttons and a tribe list with online/offline status (Net.known). Smoke-tested in headless Chromium.
- Next: verify on devices.
