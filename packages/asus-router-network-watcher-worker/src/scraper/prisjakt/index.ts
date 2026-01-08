import type { Product } from '@prisma/client';
import { logStep } from '@worker/helpers';
import path from 'path';
import { openBrowser } from '@worker/lib/browser';
import { ensureCookiesAreAccepted } from '../finn/helpers';
import { ElementHandle, Page } from 'puppeteer';
import { buildPrisjaktSearchUrl } from './helpers';
import { PRISJAKT_BASE_URL } from '@worker/constants';
import { runScript } from '../helpers';

async function resolveKomplettProductUrl(product: Product, url: string): Promise<string | null> {
  logStep(`Attempting to resolve correct product from Prisjakt product candidates for product ${product.name}`);

  logStep('Opening browser');
  const { page, browser } = await openBrowser();

  logStep(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  const storeName = 'Komplett';
  let prisjaktExternalLink: string | null = null;

  const offers = await page.$$('ul[data-testid="primary-price-list"] li');
  for (const offer of offers) {
    const titleElement = await offer.$('[class*="StoreInfoTitle"]');
    const title = await titleElement?.evaluate(el => el.textContent);
    if (title === storeName) {
      const linkElement = await offer.$('a');
      const link = await linkElement?.evaluate(el => el.getAttribute('href'));
      if (link) {
        prisjaktExternalLink = link;
        break;
      }
    }
  }

  await page.close();
  await browser.close();
  logStep('Browser closed');

  if (prisjaktExternalLink) {
    logStep(`Found link: ${prisjaktExternalLink}`);
    return prisjaktExternalLink;
  }

  logStep('No link found');
  return null;
}

export async function resolvePrisjaktUrl(product: Product) {
  const productCandidateUrls = (await resolveProductCandidates(product)).slice(0, 1);
  for (const url of productCandidateUrls) {
    const externalUrl = await resolveKomplettProductUrl(product, url);

    if (externalUrl) {
      logStep(`Resolving external url: ${externalUrl}`);
      const realUrl = await resolveUrlFromExternalPrisjaktUrl(externalUrl);
      logStep(`Real URL ${realUrl}`);
    }
  }
}

async function resolveUrlFromExternalPrisjaktUrl(url: string): Promise<string|false> {
  const scriptPath = path.join(path.dirname(__filename), 'resolveExternalUrl.cjs');
  const externalUrl = await runScript(scriptPath, [url]);
  return externalUrl ? externalUrl : false;
}

async function resolveProductCandidates(product: Product) {
  logStep(`Resolving Prisjakt Product candiates for ${product.name}`);

  logStep('Opening browser');
  const { page, browser } = await openBrowser();

  const url = buildPrisjaktSearchUrl(product);
  logStep(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  const rows = await page.$$('ul[data-test="ProductGrid"] li[data-test="ProductGridCard"] a');
  const productUrls = (await Promise.all(rows.map(async row => {
    const url = await row.evaluate(el => el.getAttribute('href'));
    return url ? `${PRISJAKT_BASE_URL}${url}`: null;
  }))).filter(u => u !== null);

  await page.close();
  await browser.close();
  logStep('Browser closed');

  return productUrls;
}

export async function getLowestPrice(product: Product) {
  logStep('Opening browser');
  const { page, browser } = await openBrowser();

  if (!product.prisjaktUrl) {
    throw new Error('Product does not have a prisjakt url');
  }

  logStep(`Navigating to ${product.prisjaktUrl}`);
  await page.goto(product.prisjaktUrl, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  const rows = await page.$$('ul[data-testid="primary-price-list"] li');

  const lowestPrice = await resolvePrice(rows);

  await page.close();
  await browser.close();
  logStep('Browser closed');

  return lowestPrice
}

async function resolvePrice(rows: ElementHandle<HTMLLIElement>[]): Promise<{ price: number, url: string }> {
  return new Promise(async (resolve, reject) => {
    for (const row of rows) {
      const priceElement = await row.$('h4[class*="PriceLabel"]');
      const rawPrice = await priceElement?.evaluate(el => el.textContent);
      if (!rawPrice) {
        continue;
      }
      const price = parseInt(rawPrice.trim().replace(/\D/g, ''));
      if (price) {

        const urlElement = await row.$('a[class*="ExternalLink"]');
        const url = await urlElement?.evaluate(el => el.getAttribute('href')) || '';
        resolve({ price, url });
        break;
      }      
    }
  });
}