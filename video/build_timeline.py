import json, subprocess
LEAD, TAIL, OVER = 0.45, 0.75, 0.4
EXTRA = {"s11": 4.0, "s1": 0.2}
themes = {"s1":"light","s2":"dark","s3":"light","s4":"dark","s5":"light","s6":"light","s7":"light","s8":"light","s9":"light","s10":"light","s11":"dark"}
script = json.load(open("script.json"))
t = 0.0; scenes = []
for sid, txt in script:
    words = json.load(open(f"vo/{sid}.mp3.words.json"))
    last = words[-1]["t"] + words[-1]["d"]
    dur = LEAD + last + TAIL + EXTRA.get(sid, 0)
    scenes.append({"id": sid, "start": round(t,3), "dur": round(dur,3), "vo": round(t+LEAD,3), "theme": themes[sid],
                   "words": [{"t": round(w["t"]+LEAD,3), "d": round(w["d"],3), "w": w["w"]} for w in words]})
    t += dur - OVER
total = round(t + OVER, 3)
tl = {"scenes": scenes, "total": total, "fps": 30}
json.dump(tl, open("timeline.json","w"), ensure_ascii=False)
open("timeline.js","w").write("window.TIMELINE=" + json.dumps(tl, ensure_ascii=False) + ";")
print("total", total)
for s in scenes: print(s["id"], s["start"], s["dur"])
