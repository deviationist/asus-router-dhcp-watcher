import { extractSkuFromUrl, getProducts } from '@/scraper/komplett-club'
import { expect, test, expectTypeOf } from 'vitest'

test('that we can get products from Komplett Club', async () => {
  const products = await getProducts();
  expectTypeOf(products).toBeArray();
  expect(products.length).toBeGreaterThan(0);

  for (const product of products) {
    expect(product).toHaveProperty('sku');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('url');
    expect(product).toHaveProperty('originalPrice');
    expect(product).toHaveProperty('discountedPrice');
    expect(product).toHaveProperty('discount');
    expect(product).toHaveProperty('discountPercent');

    expectTypeOf(product.sku).toBeString();
    expectTypeOf(product.name).toBeString();
    expectTypeOf(product.url).toBeString();
    expectTypeOf(product.originalPrice).toEqualTypeOf<number | null>();
    expectTypeOf(product.discountedPrice).toEqualTypeOf<number | null>();
    expectTypeOf(product.discount).toEqualTypeOf<number | null>();
    expectTypeOf(product.discountPercent).toEqualTypeOf<number | null>();
  }
});

test('that we can extract SKU from URL', async () => {
  expect(extractSkuFromUrl('https://www.komplett.no/product/1302143/hjem-fritid/kjoekkenapparater/airfryer/andersson-afr-25-airfryer-med-2-kurver-sort')).toBe('1302143');
});