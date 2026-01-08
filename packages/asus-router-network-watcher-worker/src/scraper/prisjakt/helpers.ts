import { Product } from '@prisma/client';
import { PRISJAKT_BASE_URL } from '@worker/constants';

export function buildPrisjaktSearchUrl(product: Product) {
  return `${PRISJAKT_BASE_URL}/search?search=${encodeURIComponent(product.originalName)}`;
}