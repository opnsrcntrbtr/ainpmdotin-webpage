# DRAFT — upstream pull request for screenpipe (not opened)

> Prepared by the portfolio loop on 11 Nov 2026 for Ian to review. Nothing has been
> pushed or opened. Source: branch `feat/lecture-capture` in ~/screenpipe-local
> (commits 23a3dfe32, 444a9c545, 076ae7622), based on upstream main c88ffa4b2 (17 Sep 2026).

## Before opening

- [ ] Rebase on current upstream `main`. Upstream has since added
      `any_drm_window_on_screen()` (CoreGraphics window list, no ScreenCaptureKit) in
      `crates/screenpipe-engine/src/drm_detector.rs`; commit 076ae7622's
      "keep pausing while a DRM page is visible" may overlap and should reuse it.
- [ ] Split into two PRs (maintainers review smaller changes faster):
      1. App audio tap (23a3dfe32)
      2. Configurable DRM pages + keep audio + immediate release (444a9c545, 076ae7622)
- [ ] Remove `Co-Authored-By` / `Claude-Session` trailers if the project prefers plain commits.
- [ ] Remove any course- or vendor-specific names from commit messages (444a9c545 names the
      course platform and video vendor; replace with "a course portal's DRM player").
- [ ] Run `cargo test -p screenpipe-audio --lib app_tap` and the drm_detector unit tests.
- [ ] Per CONTRIBUTING.md, confirm you are an active screenpipe user (you are) and follow
      its PR template.

---

## PR 1 — feat(audio): record one application's own output (app tap)

**Problem.** Recording audio from a browser lecture through the system output device also
records every other sound on the machine; through the microphone it records the room.

**Change.** Adds a session-scoped virtual device backed by the existing per-pid process tap
(the one the meeting piggyback already uses), following the pids of configured apps.

- `core/device.rs`: `APP_TAP_DEVICE_NAME` and `is_per_pid_tap_device()`
- `core/stream.rs`: the per-pid tap branch serves both virtual tap devices
- `audio_manager/manager.rs`: `start_app_tap_device()` — `start_session_device` without
  the meeting gate; all other guards kept
- `audio_manager/app_tap.rs` (new): watcher that re-attaches when the owning process
  restarts, backs off otherwise, and names the macOS permission when capture is refused
- engine binary: spawns the watcher when `SCREENPIPE_AUDIO_TAP_APPS` is set

**Why an environment variable?** Keeps the change small and opt-in; happy to move it to a
CLI flag or the settings schema if maintainers prefer.

**Tests.** `cargo test -p screenpipe-audio --lib app_tap` (4 passed).

---

## PR 2 — feat(drm): user-configurable DRM pages, optional audio during pause, immediate release

**Problem.** Course and training portals stream DRM-protected video. While ScreenCaptureKit
captures the screen, Chrome blanks it. `--pause-on-drm-content` fixes this only for a fixed
list of streaming services, and it also stops output audio, which a controlled test showed
does not blank protected video and is the part users want to keep.

Controlled test (macOS, Chrome, DRM player focused):

| Phase | Held by screenpipe | Video |
|---|---|---|
| A | ScreenCaptureKit screen, no audio | black |
| B | system audio via ScreenCaptureKit, no screen | visible |
| C | system audio via CoreAudio process tap | visible |
| D | running, screen and audio off | visible |
| E | text-only vision + audio | black |

**Changes.**
- `SCREENPIPE_DRM_URLS`: extra DRM pages as `host` or `host/path-prefix`, added to the
  built-in list (unit test covers path matching and look-alike hosts)
- `SCREENPIPE_DRM_KEEP_AUDIO=1`: keep audio devices running during the DRM pause
- Wake the monitor watcher on every pause/resume transition; it previously slept up to its
  60 s backstop with ScreenCaptureKit still open, so the pause flag was set but video stayed
  black
- For configured pages, treat an on-screen browser window showing one as DRM content before
  capturing and before clearing the pause, so focusing another app no longer resumes capture
  over a visible protected video (reuse `any_drm_window_on_screen()` after rebase)

**Size.** +83/−5 in 3 files and +105/−1 in 2 files before rebase.

**Not in scope.** No attempt to capture protected frames; the pause is the intended behaviour.

**Verified.** Live on 30 Sep 2026: video visible, audio transcribed, sessions rebuilt from
page markers.
