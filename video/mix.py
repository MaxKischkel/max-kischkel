import json, subprocess, numpy as np, wave
SR=48000
tl=json.load(open('timeline.json')); T=tl['total']+0.2; N=int(T*SR)
t=np.arange(N)/SR
def note(m): return 440*2**((m-69)/12)
# --- pad: Dmaj9 - Bm7 - Gmaj7 - Asus ---
chords=[[50,57,61,64,66],[47,54,57,62,66],[43,50,54,59,62],[45,52,57,59,64]]
bars=4.0
pad=np.zeros(N)
def lp(x,a):
    y=np.empty_like(x); acc=0.0
    # vectorised one-pole via scipy-free cumulative trick is hard; use small loop in chunks
    import numpy as _n
    from itertools import accumulate
    return _n.array(list(accumulate(x, lambda p,v: p+a*(v-p))))
for k in range(int(T/bars)+2):
    st=k*bars; ch=chords[k%4]
    a=int(st*SR); b=min(N,int((st+bars+1.5)*SR))
    if a>=N: break
    tt=np.arange(b-a)/SR
    env=np.minimum(1,tt/1.2)*np.clip((bars+1.5-tt)/1.5,0,1)
    seg=np.zeros(b-a)
    for m in ch:
        f=note(m+12)
        for det in (-0.12,0.12):
            ff=f*2**(det/12)
            seg+=np.sin(2*np.pi*ff*tt+det)+0.18*np.sin(4*np.pi*ff*tt)+0.06*np.sin(6*np.pi*ff*tt)
    seg+=1.6*np.sin(2*np.pi*note(ch[0])*tt)  # bass
    pad[a:b]+=seg*env
pad/=np.abs(pad).max()
# --- soft plucks (arpeggio) ---
pl=np.zeros(N); step=0.5
i=0
while i*step<T:
    st=i*step; ch=chords[int(st//bars)%4]
    m=ch[[1,2,3,4,3,2,1,3][i%8]]+12
    a=int(st*SR); L=int(1.2*SR); b=min(N,a+L); tt=np.arange(b-a)/SR
    f=note(m); env=np.exp(-tt*5.5)*np.minimum(1,tt/0.004)
    pl[a:b]+=(np.sin(2*np.pi*f*tt)+0.3*np.sin(4*np.pi*f*tt))*env*(0.9 if i%2==0 else 0.6)
    i+=1
pl/=np.abs(pl).max()
music=0.55*pad+0.30*pl
# smooth (lowpass) a bit
k=np.ones(9)/9; music=np.convolve(music,k,mode='same')
# --- whoosh at scene starts ---
rng=np.random.default_rng(1)
wh=np.zeros(N)
for s in tl['scenes'][1:]:
    a=int((s['start']-0.35)*SR); L=int(0.8*SR); tt=np.arange(L)/SR
    n=rng.standard_normal(L); n=np.convolve(n,np.ones(40)/40,mode='same')
    env=np.sin(np.pi*np.clip(tt/0.8,0,1))**2
    wh[a:a+L]+=n*env
wh/=np.abs(wh).max()+1e-9
# --- VO ---
vo=np.zeros(N)
for s in tl['scenes']:
    raw=subprocess.run(['ffmpeg','-v','error','-i',f"vo/{s['id']}.mp3",'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
    x=np.frombuffer(raw,np.int16).astype(float)/32768
    a=int(s['vo']*SR); b=min(N,a+len(x)); vo[a:b]+=x[:b-a]
# ducking: music lower while voice active
act=np.abs(vo)>0.02
win=int(0.25*SR); act=np.convolve(act.astype(float),np.ones(win)/win,mode='same')>0.01
duck=np.where(act,1.0,0.0); duck=np.convolve(duck,np.ones(int(0.4*SR))/int(0.4*SR),mode='same')
mgain=0.16*(1-duck)+0.07*duck
fade=np.minimum(1,t/1.5)*np.clip((T-0.2-t)/3.0,0,1)
mix=vo*0.95+music*mgain*fade+wh*0.035
mix/=max(1,np.abs(mix).max()/0.97)
w=wave.open('mix.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
print('ok',T)
