import { fetchLowestPriceForProduct } from '@worker/actions/prisjakt/fetchLowestPrice';

export async function fetchLowestPrice(productId: string) {
  await fetchLowestPriceForProduct(productId);
}