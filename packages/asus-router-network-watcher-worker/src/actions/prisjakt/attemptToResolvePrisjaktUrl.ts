import prisma from '@worker/lib/prisma';
import { resolvePrisjaktUrl } from '@worker/scraper/prisjakt';

export async function attemptToResolvePrisjaktUrl() {
  const products = await prisma.product.findMany({
    where: {
      prisjaktUrl: null,
      isPackage: false,
    }
  });
  for (const product of products.slice(0, 1)) {
    await resolvePrisjaktUrl(product);
  }
}