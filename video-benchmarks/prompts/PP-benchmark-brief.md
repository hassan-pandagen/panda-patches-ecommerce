# Panda Patches — Model Benchmark Brief
# Run this SAME prompt on all 4 models available on fal.ai
# Cost estimate: ~$3-5 total for all 4 runs at 5-8 seconds each

---

## THE TEST PROMPT (use this verbatim on all 4 models)

"A pair of hands opens a matte black mailer on a wooden desk. Inside,
a stack of custom embroidered patches wrapped in tissue paper. Close-up
on the top patch — bold logo, tight stitching, vivid red and gold colors.
Hands lift the patch, hold it up to warm natural window light. Shallow
depth of field, soft bokeh. UGC aesthetic. 9:16 vertical. 8 seconds."

---

## 4 Models Available on fal.ai

| # | Model | Price/sec | Est. cost (8s) | Why test it |
|---|---|---|---|---|
| 1 | Wan 2.5 | $0.05/sec | ~$0.40 | Cheapest, 20s per $1, great value |
| 2 | Kling 2.5 Turbo Pro | $0.07/sec | ~$0.56 | Best hand/motion realism |
| 3 | Veo 3 | $0.40/sec | ~$3.20 | Google's model, highest quality |
| 4 | Ovi | $0.20/video | ~$0.20 | Cheapest per video, good for testing |

**Total benchmark cost: ~$4.36 for all 4**

Note: Seedance 2.0 is Higgsfield-exclusive — not on fal.
If you want Seedance, you'd need Higgsfield separately.
Veo 3 is expensive but likely best quality — worth one test.

---

## How to run in Claude Code (VS Code terminal)

First add the MCP:
```bash
export FAL_KEY=your_key_here
claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer $FAL_KEY"
```

Then ask Claude sequentially in VS Code:
```
Using the fal-ai MCP, generate a video using Wan 2.5 at 9:16,
8 seconds, 720p: "[paste prompt]"
```
Save each URL before running next model.

---

## Scoring Sheet (fill after each run)

### Model 1: Wan 2.5 (~$0.40)
- URL:
- Prompt adherence (1-5):
- Hand realism (1-5):
- Motion coherence (1-5):
- Style fit for Panda Patches (1-5):
- Notes:

### Model 2: Kling 2.5 Turbo Pro (~$0.56)
- URL:
- Prompt adherence (1-5):
- Hand realism (1-5):
- Motion coherence (1-5):
- Style fit for Panda Patches (1-5):
- Notes:

### Model 3: Veo 3 (~$3.20)
- URL:
- Prompt adherence (1-5):
- Hand realism (1-5):
- Motion coherence (1-5):
- Style fit for Panda Patches (1-5):
- Notes:

### Model 4: Ovi (~$0.20)
- URL:
- Prompt adherence (1-5):
- Hand realism (1-5):
- Motion coherence (1-5):
- Style fit for Panda Patches (1-5):
- Notes:

---

## After benchmark — fill routing rules

- Unboxing/UGC clips →
- Product detail close-ups →
- Tactical/dark aesthetic →
- Clean brand/hat patch →
- Best value workhorse →
