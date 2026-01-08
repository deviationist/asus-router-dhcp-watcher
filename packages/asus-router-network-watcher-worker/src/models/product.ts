import prisma from '@worker/lib/prisma';
import { Product } from '@prisma/client';

export async function getActiveProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
    }
  });
}