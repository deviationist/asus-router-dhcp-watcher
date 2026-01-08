import { logStep } from '@worker/helpers';
import { openBrowser } from '@worker/lib/browser';
import { Cookie } from '@prisma/client';
import { resolveCookieFrameByUrl } from '@worker/scraper/helpers';
import { Browser, Page } from 'puppeteer';
import dayjs from 'dayjs';
import prisma from '@worker/lib/prisma';
import { SCHIBSTED_COOKIE_FRAME_URL } from '@worker/constants';

function generateAuthCookie(cookie: Cookie) {
  return [
    {
      name: '__flt',
      value: cookie.value,
      //value: 'Y22VcAwP6Lbx8BgZHmAG8V07AJHWmjpOVeCLNGh1ymYG57RFjNkjPQo5qCM2z0R7',
      path: '/',
      domain: '.finn.no',
      httpOnly: true,
      secure: true,
      expires: dayjs().add(31, 'days').unix(),
    }
  ];
}

export async function openFinnBrowser(): Promise<{ page: Page, browser: Browser }> {
  const browserObject = await openBrowser();

  const cookie = await prisma.cookie.findFirst({ where: { name: 'finn' } });
  if (!cookie?.value) {
    throw new Error('Could not find Finn cookie');
  }

  await browserObject.page.setCookie(...generateAuthCookie(cookie));
  return browserObject;
}

export async function ensureCookiesAreAccepted(page: Page) {
  const frame = await resolveCookieFrameByUrl(page, SCHIBSTED_COOKIE_FRAME_URL);
  if (!frame) {
    throw new Error('Could not resolve cookie frame');
  }
  const element = await frame.waitForSelector('button[title="Godta alle"]');
  if (element) {
    logStep('Clicking on accept all cookies');
    await element.click();
    logStep('Clicked on accept all cookies');
  } else {
    logStep('Cookies appear to already be accepted');
  }
}