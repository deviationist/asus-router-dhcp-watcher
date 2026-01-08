const { connect } = require('puppeteer-real-browser')

const url = process.argv?.[2];

if (!url) {
  console.log('missing-url');
  process.exit(1);
}

let interval;

(async () => {
  const { browser, page } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false
    // proxy:{
    //     host:'<proxy-host>',
    //     port:'<proxy-port>',
    //     username:'<proxy-username>',
    //     password:'<proxy-password>'
    // }
  });
  
  await page.goto(url);

  interval = setInterval(async () => {  
    const url = page.url();
    if (url.includes('komplett.no')) {
      await done(browser, page);
      console.log(clearQueryString(url));
      process.exit(0);
    }
  }, 1000);
  setTimeout(async () => {
    await done(browser, page);
    console.log('timeout');
    process.exit(1);
  }, 1000 * 60);
})();

async function done(browser, page) {
  await page.close();
  await browser.close();
  clearInterval(interval);
}

function clearQueryString(url) {
  const urlObj = new URL(url);
  urlObj.search = '';
  return urlObj.toString();
}