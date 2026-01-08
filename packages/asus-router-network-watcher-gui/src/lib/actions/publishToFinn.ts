import { publishDraft } from '@worker/scraper/finn/create';
import { deleteAd } from '@worker/scraper/finn/delete';
import prisma from '../prisma';

export async function publishToFinn(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product) {
    await publishDraft(product);
  }
}

export async function unpublishFromFinn(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product?.finnId) {
    await deleteAd(product.finnId);
  }
}