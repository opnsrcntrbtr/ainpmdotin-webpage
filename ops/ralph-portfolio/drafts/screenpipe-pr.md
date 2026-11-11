# Upstream screenpipe pull requests — review of the draft (not opened)

> Reviewed 11 Nov 2026 against upstream `main` at 79c05c3fc (same day). Nothing has been
> pushed, rebased or opened. Source: branch `feat/lecture-capture` in ~/screenpipe-local
> (commits 23a3dfe32, 444a9c545, 076ae7622), based on c88ffa4b2 (17 Sep 2026).

## Verdict

Worth opening, as two PRs, after five fixes. Upstream has no equivalent of any of the three
changes (no `app_tap`, `SCREENPIPE_DRM_URLS` or keep-audio option on `main`).

## Corrections to the first draft

- **Wrong:** "upstream has since added `any_drm_window_on_screen()`". It already existed at
  the branch's base; commit 076ae7622 calls it and adds `extra_drm_browser_window_on_screen()`
  beside it. No overlap to resolve.
- **Wrong for this project:** the draft offered a ready-made PR description. screenpipe's
  CONTRIBUTING.md has an AI-assisted contribution policy: the problem statement, rationale
  and replies to maintainers must be in your own words, AI use must be disclosed (tool,
  autonomy level, what you personally verified), and an autonomous agent must not submit the
  PR. Use the notes below as facts to write from, not as text to paste.

## Must fix before opening

1. **Rebase: one real conflict.** The branch is 996 commits behind. Seven files merge
   cleanly; `crates/screenpipe-audio/src/audio_manager/manager.rs` conflicts. Upstream
   refactored `start_session_device` to call a new `ensure_recording_handle()`.
   `start_app_tap_device()` still carries the old inline `record_device` /
   `recording_handles.insert` block. Resolution: keep both functions, and replace that block
   in `start_app_tap_device()` with the same `ensure_recording_handle(device)` call and
   rollback that `start_session_device` now uses. DRM files were touched upstream by only one
   commit since the base and merge cleanly.
2. **Course and vendor names are in the code, not only a commit message.** In
   `drm_detector.rs`: a doc comment (`upgrad.com/lxp/learner/player`), a comment about the
   player's window title, and five lines of the unit test use the real course-portal host.
   Commit 444a9c545's message names the platform and the video vendor. Replace all with
   neutral hosts (`learn.example.edu/player`, `videos.example.org`), as the public Lecture
   Lens repo already does.
3. **Author email.** Commit 23a3dfe32 is authored with your personal Gmail address; the
   other two use the GitHub noreply address. Rewrite the author during the rebase, or GitHub
   will publish the address (and reject the push if email privacy is on).
4. **Follow the PR template.** It asks for: description and related issue; the AI-assistance
   block (tools, autonomy level, what you verified, two checkboxes); evidence type; and a
   before/after recording for behaviour changes (attached to the PR, never committed).
   For PR 2, the five-phase table below is the "before"; a short recording of the protected
   player staying visible while capture is paused is the "after". Use a demo page, not the
   course.
5. **Re-run tests after the rebase** and quote the exact commands, since the policy says never
   to claim testing you did not perform:
   `cargo test -p screenpipe-audio --lib app_tap` and the `drm_detector` unit tests.

## Suggested, not required

- Open an issue first for each change and link it; both add opt-in behaviour that maintainers
  may prefer as settings or CLI flags rather than environment variables. Say you are happy to
  change that.
- Keep the two PRs independent: PR 1 touches `screenpipe-audio` plus one spawn line in the
  engine binary; PR 2 touches `drm_detector.rs`, `monitor_watcher.rs` and the engine binary.
  Both edit `screenpipe-engine.rs`, so whichever lands second needs a trivial rebase.
- The `Co-Authored-By` trailers are an honest disclosure; keep them or move the disclosure
  into the template's AI block, whichever maintainers prefer.

## Facts to write from

**PR 1 — record one application's own audio (app tap).** 4 unit tests. +245 lines in a new
`audio_manager/app_tap.rs`, +67 in `manager.rs`, +14 in `core/device.rs`, small edits in
`core/stream.rs`, `mod.rs` and the engine binary. Problem: the system output device records
every sound on the machine and the microphone records the room. Change: a session-scoped
virtual device on the existing per-pid process tap, following the pids of apps named in
`SCREENPIPE_AUDIO_TAP_APPS`; it re-attaches when the app restarts and names the macOS
permission when capture is refused. All existing guards kept (capture disabled, screen
locked, device paused by the user).

**PR 2 — configurable DRM pages, optional audio during the pause, immediate release.**
`drm_detector.rs` +176, `monitor_watcher.rs` +13. Problem: `--pause-on-drm-content` knows a
fixed list of streaming services and stops output audio too; and the pause flag could be set
while ScreenCaptureKit stayed open for up to the watcher's 60-second backstop.

| Phase | Held by screenpipe | Protected video |
|---|---|---|
| A | ScreenCaptureKit screen, no audio | black |
| B | system audio via ScreenCaptureKit, no screen | visible |
| C | system audio via CoreAudio process tap | visible |
| D | running, screen and audio off | visible |
| E | text-only vision + audio | black |

Changes: `SCREENPIPE_DRM_URLS` (host or host/path-prefix, with a look-alike-host test);
`SCREENPIPE_DRM_KEEP_AUDIO=1`; a notify that wakes the monitor watcher on every pause or
resume; and treating a visible browser window on a configured page as DRM content before
capturing and before clearing the pause. Not in scope: capturing protected frames.
Verified live on 30 Sep 2026 (video visible, audio transcribed).
