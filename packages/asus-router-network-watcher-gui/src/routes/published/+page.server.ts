import { resolveProduct } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import type { Product } from '@prisma/client';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: { params: any }) {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      publishedAt: { not: null }
    }
  });
  return { 
    products: products.map((product: Product): ResolvedProduct => resolveProduct(product))
  };
}

/** @type {import('./$types').Actions} */
export { actions } from '../+page.server';