import type { Product } from '@prisma/client';

export function resolveProduct(product: Product): ResolvedProduct {
  return {
    ...product,
    images: JSON.parse(product.images),
    thumbnail: product.thumbnail ? Buffer.from(product.thumbnail).toString('base64') : null
  };
}