import { delay, logStep } from '@worker/helpers';
import { ensureCookiesAreAccepted, openFinnBrowser } from './helpers';
import { extractIdFromFinnAdUrl, getButtonByText } from '../helpers';

export async function deleteAllDrafts() {
  logStep('Opening browser');
  const { page, browser } = await openFinnBrowser();

  const url = `https://www.finn.no/my-items?statusFacetId=DRAFT`;
  logStep(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  logStep('Attempting to delete all drafts');
  const ads = await page.$$('section[aria-label="Annonser"] > div > div h3 a');
  const adIds = (await Promise.all(ads.map(async ad => {
    const href = await ad.evaluate(node => node.getAttribute('href'));
    return href ? extractIdFromFinnAdUrl(href) : false;
  }))).filter(Boolean) as string[];

  await page.close();
  await browser.close();
  logStep('Browser closed');

  if (adIds.length > 0) {
    for (const adId of adIds) {
      await deleteAd(adId);
    }
  } else {
    logStep('No drafts to delete');
  }
}

export async function deleteAd(adId: string) {
  logStep('Opening browser');
  const { page, browser } = await openFinnBrowser();

  const url = `https://www.finn.no/my-items/details/${adId}`;
  logStep(`Navigating to ${url}`);
  const [rsp] = await Promise.all([
    page.waitForNavigation(),
    page.goto(url, { waitUntil: 'domcontentloaded' })
  ]);

  logStep('Page loaded');

  if (rsp?.status() === 404) {
    logStep('Ad not found/already deleted');
  } else {
    logStep('Ensuring cookies are accepted');
    await ensureCookiesAreAccepted(page);
    
    logStep('Attempting to delete ad');
    await (await getButtonByText(page, 'Slett'))?.click();
    logStep('Clicked on delete button');

    await delay(250);


    await page.evaluate(() => {
      const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('div[role="dialog"] button');
      const lastButton = Array.from(buttons).pop();
      lastButton?.click();
    });
    logStep('Confirmed deletion dialog');

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    logStep('Ad deleted');
  }

  await page.close();
  await browser.close();
  logStep('Browser closed');
}