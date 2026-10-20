"""Recharge film voiceover: Kokoro text-to-speech (open model, runs locally), voice bm_daniel.

bm_daniel at 1.1x: a brisk, upbeat British male voice (about 125 Hz). Tried and set aside:
bm_lewis (deeper, about 100 Hz, felt too deep and slow) and am_onyx (American, deepest).

Each phrase is its own clip so it can land on the beat. Clips and scenes are placed together:
every clip starts on a beat (15 frames) once the picture is ready for it, and every scene starts
when the previous lines are done, so changing a line, the voice or the speed retimes the film.
This script writes public/vo/c-<key>.wav, levelled to the same loudness, and src/timeline.json.

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
VOICE, LANG, SPEED, FPS = "bm_daniel", "en-gb", 1.1, 30
BEAT = 15

LINES = {
    "messy": "Running a short let gets messy.",
    "what": "What if it didn't have to be?",
    "g1": "Guests.", "g2": "Cleans.", "g3": "Repairs.", "g4": "Owners.",
    "one": "All in one place.",
    "meet": "Meet Recharge.", "runs": "One app that runs every home.",
    "job": "Every job has an owner, a status, and a record.",
    "s1": "Owners see their payouts.", "s2": "Cleaners see their schedule.", "s3": "Guests get answers.",
    "conn": "All connected.", "real": "With real people on hand, twenty four seven.",
    "end1": "Recharge.", "end2": "Short stays, run properly.",
}

os.makedirs(MODELS, exist_ok=True)
for name in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
    path = os.path.join(MODELS, name)
    if not os.path.exists(path):
        print("downloading", name)
        urllib.request.urlretrieve(BASE + name, path)
k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))

audio = {}
for key, text in LINES.items():
    a, sr = k.create(text, voice=VOICE, speed=SPEED, lang=LANG)
    on = np.abs(a) > 0.01
    i, j = np.argmax(on), len(a) - np.argmax(on[::-1])
    a = a[max(0, i - int(0.015 * sr)): j + int(0.04 * sr)]
    a = a * (10 ** (-18 / 20) / np.sqrt((a ** 2).mean()))
    a = np.tanh(a / 0.9) * 0.9  # soft limit, no clipping
    sf.write(os.path.join(ROOT, "public", "vo", f"c-{key}.wav"), a.astype(np.float32), sr)
    audio[key] = int(np.ceil(len(a) / sr * FPS))

beat = lambda f: int(np.ceil(f / BEAT) * BEAT)
clips = {}
def place(key, earliest, snap=True):
    start = beat(earliest) if snap else earliest
    clips[key] = {"text": LINES[key], "start": start, "frames": audio[key]}
    return start + audio[key]
end = lambda key: clips[key]["start"] + clips[key]["frames"]

# Hook: the mess, then the question.
place("messy", 12, snap=False)
place("what", end("messy") + 8)
# Parts: one word per beat or two.
S = {"hook": 0, "parts": beat(end("what") + 10)}
t = S["parts"]
for key in ("g1", "g2", "g3", "g4"):
    t = place(key, t) + 4
# One: the line, the app icon, the click, the zoom into the app.
S["one"] = beat(end("g4") + 10)
place("one", S["one"] + 8)
one = {"cursor": clips["one"]["start"] + 30, "click": clips["one"]["start"] + 53}
S["dash"] = one["click"] + 22
# The app: camera moves are fixed frames from the scene start (Film.tsx CAM): push at +100, hold, re-angle at +160.
place("meet", S["dash"] + 12)
place("runs", end("meet") + 4)
dash = {"cursor": S["dash"] + 115, "click": S["dash"] + 150, "swap": S["dash"] + 153}
place("job", max(end("runs") + 8, S["dash"] + 165))
S["see"] = max(S["dash"] + 240, beat(end("job") + 10))
# Who sees what.
place("s1", S["see"] + 14)
place("s2", end("s1") + 8)
place("s3", end("s2") + 8)
# All connected.
S["connected"] = beat(end("s3") + 12)
place("conn", S["connected"] + 12)
place("real", end("conn") + 8)
# The end.
S["end"] = beat(end("real") + 10)
place("end1", S["end"] + 18)
place("end2", end("end1") + 12)
duration = end("end2") + 54

for key, c in clips.items():
    print(f"{key:6s} {c['start']:5d} {c['frames']:4d}")
messy_end = end("messy")
tl_path = os.path.join(ROOT, "src", "timeline.json")
tl = json.load(open(tl_path))
tl.update({
    "clips": clips, "scenes": S, "one": one, "dash": dash, "duration": duration,
    "clicks": [one["click"], dash["click"]],
    "pops": [messy_end - 18 + 6 * i for i in range(4)],
})
json.dump(tl, open(tl_path, "w"), indent=1)
print("scenes", S, "duration", duration)
