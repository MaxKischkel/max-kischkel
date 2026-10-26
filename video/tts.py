import asyncio, ssl, sys, json, os
import edge_tts, edge_tts.communicate as c
c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
LANG = os.environ.get("TTS_LANG")  # e.g. de-DE: force locale for multilingual voices
if LANG:
    _orig = c.mkssml
    def mkssml(tc, escaped_text):
        if isinstance(escaped_text, bytes): escaped_text = escaped_text.decode("utf-8")
        return (f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{LANG}'>"
                f"<voice name='{tc.voice}'>"
                f"<prosody pitch='{tc.pitch}' rate='{tc.rate}' volume='{tc.volume}'>{escaped_text}</prosody>"
                "</voice></speak>")
    c.mkssml = mkssml
async def main(voice, text, out, rate="+0%"):
    comm = edge_tts.Communicate(text, voice, rate=rate, proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
    words=[]
    with open(out,"wb") as f:
        async for ch in comm.stream():
            if ch["type"]=="audio": f.write(ch["data"])
            elif ch["type"]=="WordBoundary": words.append({"t":ch["offset"]/1e7,"d":ch["duration"]/1e7,"w":ch["text"]})
    json.dump(words, open(out+".words.json","w"), ensure_ascii=False)
if __name__=="__main__":
    asyncio.run(main(*sys.argv[1:]))
