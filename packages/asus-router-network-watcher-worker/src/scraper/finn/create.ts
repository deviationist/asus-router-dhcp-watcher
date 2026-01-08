import { delay, logStep } from '@worker/helpers';
import { Product } from '@prisma/client';
import { ensureCookiesAreAccepted, openFinnBrowser } from './helpers';
import { FINN_AD_CREATION_URL } from '@worker/constants';
import { extractIdFromFinnAdUrl } from '../helpers';
import { Page } from 'puppeteer';
import prisma from '@worker/lib/prisma';
import os from 'os';
import fs from 'fs';
import path from 'path';

export async function publishDraft(product: Product) {
  logStep('Opening browser');
  
  const { page, browser } = await openFinnBrowser();

  logStep(`Navigating to ${FINN_AD_CREATION_URL}`);
  await page.goto(FINN_AD_CREATION_URL, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  logStep('Creating new ad as draft');
  await page.evaluate(() => {
    const element = document.querySelector('#main-content > ad-insertion-frontpage-private-podlet-isolated');
    const shadowDom = element?.shadowRoot;
    const buttons = shadowDom?.querySelectorAll('button');
    if (buttons) {
      ['Torget', 'Privat'].forEach(text => {
        const button = Array.from(buttons)?.find(button => {
          return button.innerText?.trim() === text || button.textContent?.trim() === text;
        });
        button?.click();
      });
    }
  });
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const adId = extractIdFromFinnAdUrl(page.url());
  if (!adId) {
    throw new Error('Could not extract ad ID from URL');
  }
  logStep(`Ad ID: ${adId}`);

  await page.exposeFunction('salesPrice', salesPrice);
  await page.exposeFunction('productDescription', productDescription);

  await page.evaluate(async (product) => {

    const title: HTMLInputElement|null = document.querySelector('input[name="title"]');
    if (title && product.name) title.value = product.name;
    
    const description: HTMLTextAreaElement|null = document.querySelector('textarea[name="description"]');
    if (description) description.value = `${await productDescription(product)}`;

    const price: HTMLInputElement|null = document.querySelector('input[name="price.price_amount"]');
    if (price) price.value = `${await salesPrice(product)}`;

    const condition: HTMLSelectElement|null = document.querySelector('input[name="ITEM_CONDITION"]');
    if (condition) condition.value = 'BRAND_NEW';
  }, product);

  const images = JSON.parse(product.images);//.slice(0, 3);
  if (images.length) {
    logStep(`Uploading ${images.length} images`);
    await uploadImages(page, images);
  } else {
    logStep('No images to upload');
  }
  
  logStep('Updating product with ad ID');
  await prisma.product.update({
    where: { id: product.id },
    data: { 
      finnId: adId,
      publishedAt: new Date(),
    }
  });

  logStep('Ad (draft) created');

  await page.close();
  await browser.close();
  logStep('Browser closed');
}

async function uploadImages(page: Page, images: string[]) {
  await (await page.$('.file-input-button'))?.click();
  const fileInput = await page.$('input[name="image"]');

  for (const image of images) {
    const fileName = path.basename(image);
    logStep(`Uploading image ${fileName}`);
    const response = await fetch(image);
    const buffer = await response.arrayBuffer();
    const tempFilePath = path.join(os.tmpdir(), `tempfile-${Date.now()}-${fileName}`);
    fs.writeFileSync(tempFilePath, Buffer.from(buffer));
    await delay(1000);
    fileInput?.uploadFile(tempFilePath);
    await delay(100);
    fs.unlinkSync(tempFilePath);
  }
}

function productDescription(product: Product) {
  return `${product.name} selges, uåpnet.

Detaljer: ${product.description}.
Se mer info her: ${product.url}`;
}

function salesPrice(product: Product) {
  return product.discountedPrice + product.discount / 2;
}