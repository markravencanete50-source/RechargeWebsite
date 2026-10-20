"""Recharge film score: original, synthesised, locked to src/timeline.json. No samples, nothing to license.

A calm bed in D major at 120 bpm (one beat is 15 frames at 30 fps) that sits under the voiceover:

  Hook and parts   pad and soft plucks, a pop for every icon and card
  One              a click on the app, a riser and a soft impact into the app
  App and roles    a light groove (kick, clap, hats, bass, marimba), whooshes on camera moves
  Connected        drums drop out, pad and shimmer, pops as the roles arrive
  End              riser, then two punchy stabs on "Recharge" and on the tagline, and a clean
                   ring-out that finishes with the picture

The bed ducks about 8 dB under every voice clip, so the voice always sits on top.

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
S, clips = TL["scenes"], TL["clips"]


def popsnd(level=0.22, m=86):
    x = t(0.18)
    f = hz(m) * (1 + 0.5 * np.exp(-x * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 26) * level


bars = int(LENGTH / BAR) + 1
groove = (sec(S["dash"]), sec(S["connected"]))
for b in range(bars):
    t0 = b * BAR
    root, tones = CHORDS[b % 4]
    if t0 >= sec(S["end"]):
        break
    add(t0, pad(tones, BAR + 0.3, 0.07, 0.3))
    for beat in range(4):
        tb = t0 + beat * BEAT
        add(tb, bass(root if beat != 3 else root + 7, BEAT * 0.9), 0.55 if groove[0] <= tb < groove[1] else 0.3)
        for k in range(2):
            m = ARP[b % 4][(beat * 2 + k) % 4]
            add(tb + k * BEAT / 2, marimba(m, 0.11 if k else 0.13), pan=-0.25 + 0.5 * k)
        if groove[0] <= tb < groove[1]:
            if beat % 2 == 0:
                add(tb, kick(0.6), 0.6)
            else:
                add(tb, clap(), 0.4)
            add(tb, hat(), 0.35, pan=0.3)
            add(tb + BEAT / 2, hat(), 0.25, pan=0.3)

# Hook and parts: a pop for every icon, a pluck and a card pop for every word.
for i, f in enumerate(TL["pops"]):
    add(sec(f), popsnd(0.2, [86, 90, 93, 98][i]), pan=0.3)
for i, k in enumerate(["g1", "g2", "g3", "g4"]):
    add(sec(clips[k]["start"]), pluck([74, 78, 81, 86][i], 0.3, 0.5))
    add(sec(clips[k]["start"]) + 0.05, popsnd(0.14, 93), pan=(-0.4, 0.4, -0.4, 0.4)[i])

# One: click, riser, impact into the app.
for f in TL["clicks"]:
    add(sec(f), click(0.32))
add(sec(S["dash"]) - 1.0, riser(1.0, 0.2))
add(sec(S["dash"]), impact(0.55))
add(sec(S["dash"]), whoosh(0.4, 0.16))
for f in (S["dash"] + 100, S["dash"] + 160, S["see"]):
    add(sec(f) - 0.05, whoosh(0.36, 0.13))
for k in ("s2", "s3"):
    add(sec(clips[k]["start"]) - 0.15, whoosh(0.3, 0.1))

# Connected: shimmer and pops as the roles arrive.
add(sec(S["connected"]), impact(0.35))
for i in range(4):
    add(sec(S["connected"] + 10 + i * 4), popsnd(0.16, [81, 86, 90, 93][i]), pan=(-0.5, 0.5, -0.3, 0.3)[i])
for e in range(12):
    add(sec(S["connected"]) + e * BEAT / 2, marimba(ARP[0][e % 4] + 12, 0.05), pan=(-0.5 if e % 2 else 0.5))

# End: riser, two punchy stabs on the tonic, clean ring-out.
add(sec(clips["end1"]["start"]) - 1.4, riser(1.4, 0.24))
for k, f in enumerate([clips["end1"]["start"], clips["end2"]["start"]]):
    at = sec(f)
    add(at, kick(1.0), 1.0)
    add(at, impact(0.8 if k == 0 else 0.5))
    for m in (50, 62, 66, 69, 74, 78):
        add(at, pluck(m, 0.15, 1.6), pan=(m - 64) / 30)
    add(at, pad([62, 66, 69, 74, 78], 3.2 if k else 1.2, 0.13, 0.005))
add(sec(clips["end2"]["start"]), bass(38, 3.0), 1.1)

# Duck the bed about 8 dB under every voice clip, with a soft attack and release.
duck = np.ones(N)
for c in clips.values():
    if c["start"] >= S["end"]:
        continue  # the logo lines ride on the stabs instead
    i0, i1 = int(sec(c["start"]) * SR), int(sec(c["start"] + c["frames"]) * SR)
    duck[max(0, i0 - int(0.08 * SR)):min(N, i1 + int(0.25 * SR))] = 0.4
duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), "same")

mix = np.stack([reverb(L) * duck, reverb(R) * duck], axis=1)
tail = int(0.5 * SR)
mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
mix /= np.max(np.abs(mix)) / 0.5  # the bed peaks well under the voice
out = os.path.join(ROOT, "public", "audio", "score.wav")
sf.write(out, mix.astype(np.float32), SR, subtype="PCM_24")
print(out, f"{LENGTH:.2f}s")
