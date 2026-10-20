"""Recharge film voiceover: Kokoro text-to-speech (open model, runs locally), voice am_onyx.

am_onyx was picked because it matches the client's reference film: a deep, calm male voice
(about 90 Hz, the reference was 88 Hz). For a British accent, try bm_lewis.

Each phrase is its own clip so it can land on the beat. A clip starts on a beat (15 frames)
at or after its planned frame and after the previous clip plus a breath. This script writes
public/vo/c-<key>.wav, levelled to the same loudness, and the "clips" block of src/timeline.json.
Scene frames in timeline.json are set by hand to fit the clips.

Run: python3 audio/voice.py   (needs kokoro-onnx, numpy, soundfile; downloads the model once)
"""
import json
import os
import urllib.request

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "audio", "models")
BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
VOICE, SPEED, FPS = "am_onyx", 0.95, 30

CLIPS = [
    ("messy", "Running a short let gets messy.", 12),
    ("what", "What if it didn't have to be?", 90),
    ("g1", "Guests.", 165), ("g2", "Cleans.", 0), ("g3", "Repairs.", 0), ("g4", "Owners.", 0),
    ("one", "All in one place.", 0),
    ("meet", "Meet Recharge.", 0), ("runs", "One app that runs every home.", 0),
    ("job", "Every job has an owner, a status, and a record.", 0),
    ("s1", "Owners see their payouts.", 0), ("s2", "Cleaners see their schedule.", 0), ("s3", "Guests get answers.", 0),
    ("conn", "All connected."), ("real", "With real people on hand, twenty four seven."),
    ("end1", "Recharge."), ("end2", "Short stays, run properly."),
]
# Extra room before some clips, for what happens on screen between lines (frames).
GAP = {"one": 10, "meet": 40, "job": 50, "s1": 30, "conn": 30, "end1": 30}

os.makedirs(MODELS, exist_ok=True)
for name in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
    path = os.path.join(MODELS, name)
    if not os.path.exists(path):
        print("downloading", name)
        urllib.request.urlretrieve(BASE + name, path)
k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))

clips, t = {}, 0
for entry in CLIPS:
    key, text, plan = (entry + (0,))[:3]
    a, sr = k.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    on = np.abs(a) > 0.01
    i, j = np.argmax(on), len(a) - np.argmax(on[::-1])
    a = a[max(0, i - int(0.015 * sr)): j + int(0.04 * sr)]
    a = a * (10 ** (-18 / 20) / np.sqrt((a ** 2).mean()))
    a = np.tanh(a / 0.9) * 0.9  # soft limit, no clipping
    sf.write(os.path.join(ROOT, "public", "vo", f"c-{key}.wav"), a.astype(np.float32), sr)
    frames = int(np.ceil(len(a) / sr * FPS))
    start = max(plan, t + 6 + GAP.get(key, 0))
    if key != "messy":
        start = int(np.ceil(start / 15) * 15)
    clips[key] = {"text": text, "start": start, "frames": frames}
    t = start + frames
    print(f"{key:6s} {start:5d} {frames:4d}")

tl_path = os.path.join(ROOT, "src", "timeline.json")
tl = json.load(open(tl_path))
tl["clips"] = clips
json.dump(tl, open(tl_path, "w"), indent=1)
