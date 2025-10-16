const fs = require('fs');
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: 'console', level: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message, stack: err.stack}));
  page.on('requestfailed', req => logs.push({type: 'requestfailed', url: req.url(), error: req.failure()?.errorText}));
  try {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1000);
  } catch (e) {
    logs.push({type: 'goto_error', text: e.message});
  }
  fs.writeFileSync('capture_console_output.json', JSON.stringify(logs, null, 2));
  console.log('Saved capture_console_output.json');
  await browser.close();
})();
