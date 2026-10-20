"""
AI voiceover for the Recharge advertisement.

Kokoro text to speech (Apache 2.0 licence, so it can be used commercially), voice af_heart: the
clearest voice Kokoro has, and the one used in the Medville Diabetes ad the client liked. Each line
is generated whole, as a sentence, which keeps the pronunciation and rhythm natural, then the lines
are joined with short pauses into public/voiceover.wav. The start and end of every line goes to
src/voiceover.json, and every scene is timed against it.

    python3 voiceover/voiceover.py      (needs kokoro-onnx and soundfile; downloads the model once)
"""
import json
import os
import urllib.request

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MODELS = os.path.join(ROOT, "audio", "models")
BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"

# id, the words spoken, the caption shown, the pause after the line (seconds).
# The spoken text differs from the caption only where a word is written for the ear.
LINES = [
    ("hook", "Running a short let takes work, every single day. Guests, cleans, repairs, and owners, all at once.",
     "Running a short let takes work, every single day. Guests, cleans, repairs, and owners, all at once.", 0.45),
    ("brand", "Recharge is a serviced accommodation company, with homes across Glasgow, Edinburgh, and Scotland's Central Belt.",
     "Recharge is a serviced accommodation company, with homes across Glasgow, Edinburgh, and Scotland's Central Belt.", 0.4),
    ("book", "Here's how it works. Guests find a home on our website, and book direct to save ten percent.",
     "Here's how it works. Guests find a home on our website, and book direct to save 10%.", 0.35),
    ("clean", "Every booking creates a clean, with a checklist, and photo proof.",
     "Every booking creates a clean, with a checklist and photo proof.", 0.35),
    ("fix", "Problems are logged, assigned, and fixed, before the next guest arrives.",
     "Problems are logged, assigned, and fixed, before the next guest arrives.", 0.35),
    ("owners", "Owners follow every booking, statement, and payout, live in the Recharge app.",
     "Owners follow every booking, statement and payout, live in the Recharge app.", 0.4),
    ("support", "And real people are on hand, twenty four seven.",
     "And real people are on hand, 24/7.", 0.5),
    ("cta", "Recharge. Short stays, run properly. Book direct, at recharge stays dot co dot uk.",
     "Recharge. Short stays, run properly. Book direct at rechargestays.co.uk.", 0.0),
]
LEAD_IN = 0.5
END_HOLD = 2.6   # the end card stays up after the last word
SPEED = 1.08
VOICE = "af_heart"


def trim(a, sr, thresh=0.004):
    idx = np.where(np.abs(a) > thresh)[0]
    pad = int(0.04 * sr)
    return a[max(0, idx[0] - pad): min(len(a), idx[-1] + pad)] if len(idx) else a


def main():
    os.makedirs(MODELS, exist_ok=True)
    for name in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
        path = os.path.join(MODELS, name)
        if not os.path.exists(path):
            urllib.request.urlretrieve(BASE + name, path)
    k = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    sr = 24000
    out = [np.zeros(int(LEAD_IN * sr), dtype=np.float32)]
    t = LEAD_IN
    timing = []
    for key, spoken, caption, gap in LINES:
        a, sr = k.create(spoken, voice=VOICE, speed=SPEED, lang="en-us")
        a = trim(a.astype(np.float32), sr)
        dur = len(a) / sr
        timing.append({"id": key, "start": round(t, 3), "end": round(t + dur, 3), "spoken": spoken, "caption": caption})
        out += [a, np.zeros(int(gap * sr), dtype=np.float32)]
        t += dur + gap
    out.append(np.zeros(int(END_HOLD * sr), dtype=np.float32))
    audio = np.concatenate(out)
    audio = audio / np.max(np.abs(audio)) * 0.89
    sf.write(os.path.join(ROOT, "public", "voiceover.wav"), audio, sr)
    total = len(audio) / sr
    with open(os.path.join(ROOT, "src", "voiceover.json"), "w") as f:
        json.dump({"voice": VOICE, "duration": round(total, 3), "lines": timing}, f, indent=2)
    for x in timing:
        print(f'{x["id"]:8} {x["start"]:6.2f} to {x["end"]:6.2f}')
    print("total", round(total, 2), "s")


if __name__ == "__main__":
    main()
