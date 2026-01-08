import prisma from '@worker/lib/prisma';
import { getLowestPrice } from '@worker/scraper/prisjakt';

export async function fetchLowestPrice() {
  const products = await prisma.product.findMany({
    where: {
      prisjaktUrl: {
        not: null,
      }
    }
  });
  for (const product of products) {
    await fetchLowestPriceForProduct(product.id);
  }
}

export async function fetchLowestPriceForProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error('Product not found');
  }

  const l = await getLowestPrice(product);
  
  if (l) {
    const { price, url } = l;
    console.log(`Lowest price for ${product.name} is ${price} kr at ${url}`);
    await prisma.product.update({
      where: { id: productId },
      data: {
        lowestPrice: price,
        lowestPriceUrl: url,
      }
    });
  }
}