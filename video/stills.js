const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs=[]; p.on('console', m => { if (m.type()==='error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.READY);
  const times = process.argv.slice(2).map(Number);
  for (const t of times) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: __dirname + `/stills/t_${t.toFixed(1).padStart(6,'0')}.jpg`, type: 'jpeg', quality: 80 }); }
  console.log(errs.join('\n')); await b.close();
})();
