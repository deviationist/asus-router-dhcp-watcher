import { CRAWLER_DELAY_BETWEEN_PRODUCTS, CRAWLER_MAX_CONCURRENT, KOMPLETT_BASE_URL, KOMPLETT_CLUB_PRODUCT_PAGE_URL } from '@worker/constants';
import { calculateDiscountPercent, chunkArrayReduce, delay, logStep } from '@worker/helpers';
import { openBrowser } from '@worker/lib/browser';
import { Page, ElementHandle } from 'puppeteer';
import { getButtonByText } from '@worker/scraper/helpers';

export async function getProducts(): Promise<KomplettProduct[]> {
  logStep('Opening browser');
  const { page, browser } = await openBrowser();

  logStep(`Navigating to ${KOMPLETT_CLUB_PRODUCT_PAGE_URL}`);
  await page.goto(KOMPLETT_CLUB_PRODUCT_PAGE_URL, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  logStep('Getting product items');
  const productItemUrl = (await extractProductItemUrls(page));//.slice(0, 3);

  logStep('Closing browser');
  await page.close();
  await browser.close();
  
  const chunks = chunkArrayReduce(productItemUrl, CRAWLER_MAX_CONCURRENT);
  const resolvedProducts: KomplettProduct[] = [];
  
  for (const chunk of chunks) {
    (await Promise.all(chunk.map((productUrl: string) => {
      return attempt(() => resolveProduct(productUrl), 5);
    }))).map(
      product => resolvedProducts.push(product)
    );
  }

  logStep(`Resolved ${resolvedProducts.length} products`);
  return resolvedProducts;
}

async function resolveProduct(productUrl: string) {
  const { page, browser } = await openBrowser();

  logStep(`Navigating to ${productUrl}`);
  await page.goto(productUrl, { waitUntil: 'domcontentloaded' });

  logStep('Page loaded');

  logStep('Ensuring cookies are accepted');
  await ensureCookiesAreAccepted(page);

  const productContainer = await page.$('div.product-page');

  if (!productContainer) {
    throw new Error('Could not find product container');
  }

  logStep('Resolving product meta');
  const sku = (await (await productContainer.$('span[itemprop="sku"]'))?.evaluate(el => el.textContent))?.trim();
  const name = (await (await productContainer.$('h1[itemprop="name"]'))?.evaluate(el => el.textContent))?.trim();
  const description = (await (await productContainer.$('h2[itemprop="description"]'))?.evaluate(el => el.textContent))?.trim();
  const price = await resolveOriginalPrice(productContainer);
  const discountPrice = await resolveDiscountedPrice(productContainer);
  const images = await resolveProductImages(productContainer);
  const thumbnail = await resolveProductThumbnail(productContainer);
  const sizeAndWeight = await resolveSizeAndWeight(productContainer);
  const isPackage = await resolveIsPackage(page);

  logStep('Closing browser');
  await page.close();
  await browser.close();

  return {
    sku,
    name,
    thumbnailUrl: thumbnail,
    description,
    isPackage,
    originalPrice: price ?? null,
    discountedPrice: discountPrice ?? null,
    discount: price && discountPrice ? price - discountPrice : null,
    discountPercent: price && discountPrice ? calculateDiscountPercent(price, discountPrice) : null,
    url: productUrl,
    images,
    sizeAndWeight,
  };
}

async function resolveIsPackage(page: Page): Promise<boolean> {
  const alertElement = await page.$('#MainContent div[data-viewmodel="ksc-alert/ViewModel"]');
  if (alertElement) {
    const alertText = await alertElement.evaluate(el => el.textContent);
    return (alertText && (alertText?.includes('Pakkepris') || alertText?.includes('Pakketilbud'))) ? true : false
  }
  return false;
}

async function resolveSizeAndWeight(product: ElementHandle<HTMLDivElement>) {
  const columnNameMap: Record<string, string>[] = [
    {
      'Fraktvekt': 'weight',
      'Fraktbredde': 'width',
      'Frakthøyde': 'height',
      'Fraktdybde': 'depth',
    },
    {
      'Vekt': 'weight',
      'Bredde': 'width',
      'Høyde': 'height',
      'Dybde': 'depth',
    },
  ];

  for (const map of columnNameMap) {
    const sizeAndWeight = await resolveSizeAndWeightMap(product, map);
    if (sizeAndWeight) {
      return sizeAndWeight;
    }
  }
}

async function resolveSizeAndWeightMap(product: ElementHandle<HTMLDivElement>, columnNameMap: Record<string, string>) {
  const sizeAndWeight: Record<string, string> = {};
  const allRows = await product.$$('table tbody tr');
  
  await Promise.all(allRows.map(async row => {
    const th = await row.$('th');
    if (!th) return;
    const rowName = await th.evaluate(el => el.textContent);
    if (rowName && Object.keys(columnNameMap).includes(rowName)) {
      const td = await row.$('td');
      if (!td) return;
      const rowValue = await td.evaluate(el => el.textContent);
      if (rowValue) {
        const key = columnNameMap?.[rowName];
        sizeAndWeight[key] = rowValue;
      }
    }
  }));
  if (Object.keys(sizeAndWeight).length) {
    return sizeAndWeight;
  }
}

async function attempt(callback: CallableFunction, attempts: number): Promise<any> {
  const attempt = async (count: number = 0) => {
    let result;
    logStep(`Attempt ${count}`);
    try {
      result = await callback();
    } catch (error) {
      console.error('Error in tryMe', error);
    }
    if (result) {
      return result;
    }
    if (count >= attempts) {
      return result;
    }
    await delay(CRAWLER_DELAY_BETWEEN_PRODUCTS)
    return attempt(count + 1);
  };
  return attempt();
}

async function getProductUrl(product: ElementHandle<HTMLDivElement>) {
  try {
    const relativeUrl = await (await product.$('.call-to-action a:first-child'))?.evaluate(el => el.getAttribute('href'));
    return `${KOMPLETT_BASE_URL}${relativeUrl}`;
  } catch (error) {
    console.error('Error getting product url', error);
  }
}

async function resolveProductThumbnail(productItem: ElementHandle<HTMLDivElement>): Promise<string | null> {
  const image = await productItem.$('.product-images button.swiper-slide-active > img');
  if (!image) return null;
  const relativeUrl = await image.evaluate(el => el.getAttribute('src'));
  return relativeUrl ? `${KOMPLETT_BASE_URL}${relativeUrl}` : null;
}

async function resolveProductImages(productItem: ElementHandle): Promise<string[]> {
  const images = await productItem.$$('.product-images .full-size-gallery img');
  const resolvedImageUrls = await Promise.all(images.map(async (image: ElementHandle) => {
    const relativeUrl = await image.evaluate(el => el.getAttribute('data-src'));
    return relativeUrl ? `${KOMPLETT_BASE_URL}${relativeUrl}` : null;
  }));
  return resolvedImageUrls.filter(url => url !== null) as string[];
}

async function resolveOriginalPrice(productItem: ElementHandle): Promise<number | null | undefined> {
  const priceContainer = await productItem.$('.product-price');
  if (priceContainer) {
    const text = await priceContainer.evaluate(el => el.textContent);
    if (text) {
      return parseInt(text.trim().replace(/\D/g, ''));
    }
  }
  return null;
};

async function resolveDiscountedPrice(productItem: ElementHandle): Promise<number | null | undefined> {
  const priceContainer = await productItem.$('.club-price-discount.discount-price');
  if (priceContainer) {
    const text = await priceContainer.evaluate(el => el.textContent);
    if (text) {
      return parseInt(text.trim().replace(/\D/g, ''));
    }
  }
  return null;
};

export function extractSkuFromUrl(url: string): string|undefined {
  const matches = url?.match(/\/product\/([0-9]*)\//);
  if (matches) {
    return matches[1];
  }
};

async function extractProductItem(page: Page): Promise<ElementHandle<HTMLDivElement>[]> {
  return await page.$$('.product-list > div');
}

async function extractProductItemUrls(page: Page): Promise<string[]> {
  const productItems = await extractProductItem(page);
  const urls: string[] = [];
  for (const product of productItems) {
    const productUrl = await getProductUrl(product);
    if (productUrl) urls.push(productUrl);
  }
  return urls;
}

async function ensureCookiesAreAccepted(page: Page) {
  const element = await getButtonByText(page, 'Godta alle');
  if (element) {
    logStep('Clicking on accept all cookies');
    await element.click();
    logStep('Clicked on accept all cookies');
  } else {
    logStep('Cookies appear to already be accepted');
  }
}