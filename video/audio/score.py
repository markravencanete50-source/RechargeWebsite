"""Recharge film score: original, synthesised, locked to src/timeline.json. No samples, nothing to license.

120 bpm in D major, so one beat is 15 frames at 30 fps and every hit lands on a cut:

  0-4 s    Hook       a soft kick and a pluck on each word, a short riser into the turn
  4 s      Turn       impact and the first full chord as the logo lands
  6-26 s   App tour   calm groove: kick, soft clap, quiet hats, bass, marimba and pad
                      (D, Bm, G, A). A click on every tap, a whoosh on every transition
  26-30 s  Support    drums drop out, a clock tick on the eighths, riser into the end
  30 s     End        punchy stab on the tonic with sub and crash, a second stab, then a clean
                      ring-out that finishes before the picture does

Run: python3 audio/score.py   (needs numpy, scipy, soundfile)
Writes public/audio/score.wav (48 kHz stereo). The render step levels it to -16 LUFS.
"""
import json
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, "src", "timeline.json")))
FPS, SR = TL["fps"], 48_000
BEAT = 60 / TL["bpm"]
BAR = BEAT * 4
LENGTH = TL["duration"] / FPS
N = int(SR * LENGTH)
rng = np.random.default_rng(11)

L = np.zeros(N)
R = np.zeros(N)


def sec(frame):
    return frame / FPS


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t(seconds):
    return np.arange(int(seconds * SR)) / SR


def lp(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "low", fs=SR, output="sos"), x)


def hp(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def fade(n, a=0.004, r=0.03):
    e = np.ones(n)
    a, r = min(n, int(a * SR)), min(n, int(r * SR))
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[n - r:] *= np.linspace(1, 0, r)
    return e


def add(at, sig, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2) * np.sqrt(2)


# Instruments

def kick(level=1.0):
    x = t(0.45)
    f = 45 + 95 * np.exp(-x * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7)
    click = hp(rng.standard_normal(len(x)), 2000) * np.exp(-x * 160) * 0.15
    return (body + click) * level


def clap():
    x = t(0.3)
    n = bp(rng.standard_normal(len(x)), 900, 5000)
    env = sum(np.exp(-np.maximum(x - d, 0) * 60) * (x >= d) for d in (0, 0.011, 0.022)) * np.exp(-x * 12)
    return n * env * 0.35


def hat(open_=False):
    x = t(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(x)), 7000) * np.exp(-x * (14 if open_ else 70)) * 0.18


def bass(m, dur):
    x = t(dur)
    f = hz(m)
    s = np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * 2 * f * x) + 0.12 * np.sin(2 * np.pi * 3 * f * x)
    return lp(s, 600) * fade(len(x), 0.006, 0.06) * np.exp(-x * 1.2) * 0.42


def marimba(m, level=0.22):
    x = t(0.6)
    f = hz(m)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 7) + 0.25 * np.sin(2 * np.pi * 3.9 * f * x) * np.exp(-x * 26)
    return s * fade(len(x), 0.002, 0.05) * level


def pluck(m, level=0.3, dur=0.5):
    # Karplus-Strong string
    n = int(dur * SR)
    p = int(SR / hz(m))
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return lp(out, 5000) * fade(n, 0.001, 0.08) * level


def pad(notes, dur, level=0.07, attack=0.35):
    x = t(dur)
    s = np.zeros(len(x))
    for m in notes:
        for d in (-0.08, 0.0, 0.08):
            f = hz(m + d)
            s += 2 * (x * f - np.floor(0.5 + x * f))  # saw
    s = lp(s / (len(notes) * 3), 1400, 2)
    return s * fade(len(x), attack, 0.4) * level


def riser(dur, level=0.18):
    x = t(dur)
    noise = hp(rng.standard_normal(len(x)), 2500) * 0.6
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 900 * (x / dur) ** 2) / SR) * 0.25
    return (noise + sweep) * (x / dur) ** 2.5 * level


def impact(level=1.0):
    x = t(1.8)
    sub = np.sin(2 * np.pi * (38 + 40 * np.exp(-x * 9)) * x) * np.exp(-x * 2.6)
    crash = hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 3.2) * 0.22
    return (sub * 0.9 + crash) * level


def whoosh(dur=0.35, level=0.16):
    x = t(dur)
    n = rng.standard_normal(len(x))
    env = np.sin(np.pi * x / dur) ** 2
    return bp(n, 500, 4000) * env * level


def click(level=0.25):
    x = t(0.05)
    return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 120) * level


def tick(level=0.12):
    x = t(0.03)
    return hp(rng.standard_normal(len(x)), 4000) * np.exp(-x * 220) * level


def reverb(sig, seconds=1.6, mix=0.18):
    x = t(seconds)
    ir = rng.standard_normal(len(x)) * np.exp(-x * 4.5)
    ir = lp(ir, 6000) / np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(sig, ir)[: len(sig)]
    return sig * (1 - mix) + wet * mix


# Harmony: D, Bm, G, A (I vi IV V). MIDI roots and chord tones.
CHORDS = [(50, [62, 66, 69, 74]), (47, [62, 66, 71, 74]), (43, [62, 67, 71, 74]), (45, [61, 64, 69, 73])]
ARP = [[74, 78, 81, 78], [74, 78, 83, 78], [74, 79, 83, 79], [73, 76, 81, 76]]

hook, turn, roles, role = TL["hook"], TL["turn"], TL["roles"], TL["role"]
support, end = TL["support"], TL["end"]

# 0-4 s: hook. A kick and a pluck on every word, quieter kicks under the line, riser into the turn.
for i, f in enumerate(hook["words"]):
    add(sec(f), kick(0.8), 0.9)
    add(sec(f), pluck([74, 78, 81, 86][i], 0.35))
for f in hook["line"]:
    add(sec(f), pluck(69, 0.18, 0.3), pan=0.2)
for k in range(4):
    add(sec(hook["line"][0]) + k * BEAT, kick(0.6), 0.7)
    add(sec(hook["line"][0]) + k * BEAT, bass(50, BEAT * 0.9), 0.8)
add(sec(hook["line"][0]), pad([62, 66, 69], 2.0, 0.05, 0.3))
add(sec(turn["start"]) - 1.0, riser(1.0, 0.2))

# 4 s: the turn.
add(sec(turn["start"]), impact(0.9))
add(sec(turn["start"]), pad([62, 66, 69, 74], 2.2, 0.09, 0.02))
add(sec(turn["start"]), pluck(86, 0.25, 0.8), pan=-0.2)

# 6-26 s: the groove under the app tour.
groove_start, groove_end = sec(roles[0]), sec(support["start"])
bars = int(round((groove_end - groove_start) / BAR))
G = 0.7  # bed level
for b in range(bars):
    t0 = groove_start + b * BAR
    root, tones = CHORDS[b % 4]
    add(t0, pad(tones, BAR + 0.3, 0.06, 0.25), G)
    for beat in range(4):
        tb = t0 + beat * BEAT
        if beat % 2 == 0:
            add(tb, kick(0.7), 0.75 * G)
        else:
            add(tb, clap(), 0.6 * G)
        add(tb, hat(), 0.5 * G, pan=0.3)
        add(tb + BEAT / 2, hat(), 0.35 * G, pan=0.3)
        add(tb, bass(root if beat != 3 else root + 7, BEAT * 0.9), G)
        for k in range(2):
            m = ARP[b % 4][(beat * 2 + k) % 4]
            add(tb + k * BEAT / 2, marimba(m, 0.13 if k else 0.16), G, pan=-0.25 + 0.5 * k)

# A click on every tap, a whoosh into every new scene.
for r in roles:
    add(sec(r + role["tap"]), click(0.3))
    add(sec(r) - 0.18, whoosh(0.36, 0.14))
add(sec(support["start"]) - 0.18, whoosh(0.36, 0.14))

# 26-30 s: support. Pad and a ticking clock, a lift on the 24/7 slam, riser into the end.
for b in range(2):
    t0 = sec(support["start"]) + b * BAR
    add(t0, pad(CHORDS[(b + 2) % 4][1], BAR + 0.3, 0.07, 0.2))
    for e in range(8):
        add(t0 + e * BEAT / 2, tick(0.14 if e % 2 == 0 else 0.08), pan=0.15)
    for beat in (0, 2):
        add(t0 + beat * BEAT, kick(0.5), 0.6)
        add(t0 + beat * BEAT, bass(CHORDS[(b + 2) % 4][0], BEAT * 1.8), 0.8)
add(sec(support["slam"]), kick(0.7), 0.8)
add(sec(support["slam"]), pluck(81, 0.3, 0.6))
add(sec(end["start"]) - 1.5, riser(1.5, 0.24))

# 30 s: the end. Two punchy stabs on the tonic, then a clean ring-out.
for k, f in enumerate([end["start"], end["line"]]):
    at = sec(f)
    add(at, kick(1.0), 1.0)
    add(at, impact(0.8 if k == 0 else 0.45))
    for m in (50, 62, 66, 69, 74, 78):
        add(at, pluck(m, 0.16, 1.6), pan=(m - 64) / 30)
    add(at, pad([62, 66, 69, 74, 78], 2.9 if k else 1.0, 0.15, 0.005))
add(sec(end["line"]), bass(38, 2.6), 1.2)
add(sec(end["url"]), pluck(86, 0.22, 1.2))

mix = np.stack([reverb(L), reverb(R)], axis=1)
# Finish cleanly: a short fade over the last 0.6 s so nothing is cut off mid-note.
tail = int(0.5 * SR)
mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
mix /= np.max(np.abs(mix)) / 0.89
out = os.path.join(ROOT, "public", "audio", "score.wav")
sf.write(out, mix.astype(np.float32), SR, subtype="PCM_24")
print(out, f"{LENGTH:.2f}s")
