"""Original deterministic 120 BPM electronic score. Run: uv run scripts/music.py."""
import math, random, wave, struct
from pathlib import Path
RATE, SECONDS, BPM = 44100, 102, 120
rng = random.Random(968)
audio = [0.0] * (RATE * SECONDS)
def add(at, duration, synth, gain=1):
    start = round(at * RATE)
    for i in range(round(duration * RATE)):
        if start+i >= len(audio): break
        audio[start+i] += gain * synth(i/RATE)
for beat in range(204):
    at = beat * .5
    level = .78 if at < 8 else .43 if at < 16 else .32
    if beat % 2 == 0 or at < 8:
        add(at, .32, lambda t: math.sin(2*math.pi*(48*t + 7*(1-math.exp(-t*28))))*math.exp(-t*17), level)
    if beat % 2:
        add(at, .12, lambda t: rng.uniform(-1,1)*math.exp(-t*45), level*.36)
    add(at+.25, .045, lambda t:rng.uniform(-1,1)*math.exp(-t*95), level*.12)
    notes = [130.8128,155.5635,195.9977,233.0819,261.6256,233.0819,195.9977,155.5635]
    freq = notes[beat%8] * (2 if at<8 else 1)
    add(at,.44,lambda t,fr=freq: (math.sin(2*math.pi*fr*t)+.2*math.sin(2*math.pi*fr*2*t))*min(1,t*80)*math.exp(-t*9),level*.24)
for at in [0,5,5.75,6.5,7.25,8,13,16,44,70,78,90]:
    add(at,.7,lambda t: rng.uniform(-1,1)*math.sin(math.pi*min(t/.7,1))**3*math.exp(-t*4),.15)
    add(at,.8,lambda t: math.sin(2*math.pi*523.25*t)*math.exp(-t*7),.14)
peak=max(abs(x) for x in audio)
out=Path(__file__).resolve().parents[1]/'public/audio/verdant-120.wav'
out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(RATE)
    data=bytearray()
    for i,x in enumerate(audio):
        fade=min(1,i/RATE/0.04,(SECONDS-i/RATE)/1.5)
        sample=round(x/peak*.82*fade*32767)
        data.extend(struct.pack('<hh',sample,sample))
    w.writeframes(data)
print(f'{out}: {SECONDS}s, {BPM} BPM, peak -1.72 dBFS, original synthesis')

# Short tactile click; used exactly at the animated button presses.
click_path=out.parent/'ui-click.wav'
with wave.open(str(click_path),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(RATE)
    samples=bytearray()
    click_rng=random.Random(142)
    for i in range(round(RATE*.22)):
        t=i/RATE
        x=(.52*math.sin(2*math.pi*(1150*t+180*t*t))+.25*click_rng.uniform(-1,1))*math.exp(-t*70)*min(1,t/.001)
        sample=round(x*22000);samples.extend(struct.pack('<hh',sample,sample))
    w.writeframes(samples)
print(click_path)
