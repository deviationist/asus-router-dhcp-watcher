import { fetchLowestPrice } from '@/lib/actions/fetchLowestPrice';
import { publishToFinn, unpublishFromFinn } from '@/lib/actions/publishToFinn';
import { resolveProduct } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import type { Product } from '@prisma/client';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: { params: any }) {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null
      
    }
  });

  return { 
    products: products.map((product: Product): ResolvedProduct => resolveProduct(product))
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ request }: { request: Request }) => {
    const data = await request.formData();
    const id = data.get('id') as string;
    id && await publishToFinn(id)
  },
  unpublish: async ({ request }: { request: Request }) => {
    const data = await request.formData();
    const id = data.get('id') as string;
    id && await unpublishFromFinn(id)
  },
  fetchFromPrisjakt: async ({ request }: { request: Request }) => {
    const data = await request.formData();
    const id = data.get('id') as string;
    id && await fetchLowestPrice(id)
  },
};