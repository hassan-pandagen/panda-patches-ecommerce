# Video Model Routing Rules
# Fill after benchmark. This becomes the system context for future Claude sessions.

## Panda Patches
- Unboxing/UGC feel: TBD
- Product detail close-up: TBD
- Tactical/military/dark: TBD
- Clean brand/hat patch: TBD
- Varsity/school spirit: TBD

## Default params for all Panda Patches clips
- Aspect ratio: 9:16
- Duration: 8-10 seconds
- Resolution: 720p (benchmark), 1080p (final)
- Leave 1s head + tail buffer for designer trim points
- No text in frame (designer adds captions in CapCut)

## File naming convention
PP_{topic}_{date}_clip{N}of{total}_{model}_v{version}.mp4
Example: PP_unbox_2026-05-20_clip1of2_kling3pro_v1.mp4

## Handoff to designer
Each reel folder contains:
- clips/ (raw AI clips)
- script.md (exact caption text per beat)
- timing.md (beat timestamps)
- notes.md (cut points, music direction)
