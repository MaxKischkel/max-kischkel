import json, re, sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[2] if len(sys.argv)>2 else "small", device="cpu", compute_type="int8")
vodir = sys.argv[1]
script = json.load(open(vodir + "/../script.json"))
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768
for sid, txt in script:
    a = load(f"{vodir}/{sid}.mp3"); words = json.load(open(f"{vodir}/{sid}.mp3.words.json"))
    sents = [s.strip() for s in re.split(r'(?<=[.:?!,])\s+', txt) if s.strip()]
    i = 0
    for s in sents:
        n = len(s.split())
        ws = words[i:i+n]; i += n
        if not ws: continue
        t0 = max(0, ws[0]['t']-0.05); t1 = ws[-1]['t']+ws[-1]['d']+0.05
        seg = a[int(t0*16000):int(t1*16000)]
        lang, prob, allp = m.detect_language(seg)
        pd = dict(allp); de, en = pd.get('de',0), pd.get('en',0)
        flag = '  <-- EN?' if en > de else ''
        print(f"{sid:4} de={de:.2f} en={en:.2f} | {s}{flag}")
    if i != len(words): print(sid, 'WORDCOUNT MISMATCH', i, len(words))
