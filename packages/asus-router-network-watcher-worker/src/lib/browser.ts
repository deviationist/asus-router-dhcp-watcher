import { USER_AGENT } from '@worker/constants';
import { parseBoolean } from '@worker/helpers';
import puppeteer from 'puppeteer';
import { connect } from 'puppeteer-real-browser';

async function getBrowser() {
  return puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: parseBoolean(process.env.HEADLESS, true) 
  });
}

async function openBrowser() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setUserAgent(USER_AGENT);
  await page.setViewport({ 
    width: 1200, 
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false 
  });
  return { browser, page };
};


async function openRealBrowser() {
  return connect({ 
    headless: parseBoolean(process.env.HEADLESS, true) 
  });
};

export { puppeteer, getBrowser, openBrowser, openRealBrowser };