---
title: "Respecting Protected Video While Capturing Lectures"
description: "Builder's notes from Lecture Lens: why screen capture blanked a DRM lecture, the five-phase test that found the cause, and why the fix pauses capture, not bypasses it."
tldr: "Starting capture turned a DRM-protected course video black while its audio kept playing. A five-phase controlled test showed any open screen-capture stream blanks protected frames, and audio never does. So Lecture Lens pauses screen capture on listed player pages, keeps the audio for the transcript, and never tries to capture protected frames. Two regressions taught that a privacy feature is only as reliable as the permissions and timing under it."
pubDate: 2026-11-11
updatedDate: 2026-11-11
tags: ["Builder's notes", "Privacy", "Local AI"]
readingMinutes: 6
faq:
  - q: "Why does screen recording make protected video go black?"
    a: "Chrome on macOS stops presenting DRM-protected frames while a ScreenCaptureKit screen stream is open. Audio is not protected, so it keeps playing. Lecture Lens's controlled test showed even text-only capture opens the screen API and blanks the video."
  - q: "How does Lecture Lens handle protected lectures?"
    a: "It pauses screen capture whenever a listed player page is visible, keeps recording the browser's own audio, and builds notes and flashcards from the transcript. It never attempts to capture protected frames."
  - q: "What engine changes did this need?"
    a: "Three small changes to the open-source screenpipe recorder: a per-app audio tap, configurable protected-video pages with audio kept during the pause, and releasing capture immediately when a pause starts. Each is switched on by an environment variable to keep the change easy to review."
sources:
  - href: "https://opnsrcntrbtr.github.io/lecture-lens/decisions/ADR-004-drm-video-black-screen"
    label: "Lecture Lens ADR-004: course portal lecture video goes black while capturing"
  - href: "https://github.com/opnsrcntrbtr/lecture-lens"
    label: "Lecture Lens repository"
  - href: "https://github.com/screenpipe/screenpipe"
    label: "screenpipe, the open-source recorder Lecture Lens builds on"
  - href: "https://developer.apple.com/documentation/screencapturekit"
    label: "Apple — ScreenCaptureKit documentation"
---

## What went wrong?

**Starting capture from Lecture Lens turned the course's lecture video black, while its audio kept playing.** The player was DRM-protected: Widevine and PlayReady key systems behind a commercial video player. A learner would have had to choose between watching the lecture and capturing it.

## How did a controlled test find the cause?

I didn't want to guess, so I ran five phases with the learner (me) watching the video, writing the recorder's settings for each phase and restoring them afterwards:

| Phase | What the recorder held | Video |
| --- | --- | --- |
| A | Screen frames, no audio | **Black** |
| B | System audio via ScreenCaptureKit, no screen | Visible |
| C | System audio via a CoreAudio process tap, no screen | Visible |
| D | Running, screen and audio off | Visible |
| E | "Text-only" screen mode plus audio | **Black** |

Phase E was the surprise: a text-only mode still opens the screen-capture API, so no settings change could fix it. Capture had to **fully release** the screen while the player was visible. Audio was always safe.

## What did I decide, and what did I rule out?

Pause screen capture on the protected player, keep the audio, and build the lecture's notes from its transcript. I ruled out any attempt to capture protected frames. The protection works as intended, and the video stays watchable. The cost is honest and written down: recorded portal lectures have **no slide images**, so slide text has to come from the course's own decks.

The [decision record](https://opnsrcntrbtr.github.io/lecture-lens/decisions/ADR-004-drm-video-black-screen) was verified live on 30 September 2026: video visible, audio transcribed, sessions rebuilt from page markers.

## What did I change in the recorder?

The open-source screenpipe recorder already paused on a fixed list of streaming services, but it also stopped output audio. Three small changes on my branch, each switched on by an environment variable:

1. **A per-app audio tap**, so the lecture is recorded from the browser's own output: no room noise, no other apps (4 unit tests).
2. **Configurable protected-video pages**, by host or host and path, with **audio kept** during the pause (+83 lines, with a test for look-alike hosts).
3. **Immediate release**: wake the capture watcher on every pause or resume instead of waiting up to its 60-second backstop, and keep pausing while the player is still on screen (+105 lines).

They aren't upstream yet; the full story is in the [origin case study](/work/lecture-lens/origin/#engine).

## What broke after the fix?

Twice in one night the black screen came back, and both times the cause was underneath the feature:

- **A stale permission.** The pause reads the browser's URL through macOS Accessibility. A rebuild changed the app's signature, the grant no longer matched, and the pause never recognised the player. The fix: sign the app with a stable local identity, show an *Access* light, and refuse to start capture without the permission.
- **A late release.** The app showed "paused" while the screen stream stayed open for up to a minute. That was change 3 above.

## What's the product lesson?

**A privacy or rights feature is only as reliable as the permissions and timing beneath it.** Prove the cause with a controlled test, choose the option that respects the protection even when it costs you something, and add guards that refuse to run in the state that breaks it. The same habit runs through the [content guard](/articles/keeping-private-material-out-of-a-public-repo/) that keeps course material out of the public repository.
