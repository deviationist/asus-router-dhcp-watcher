<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Product } from '@prisma/client';
	import { calculateDiscountPercent } from '@worker/helpers';
  import { buildPrisjaktSearchUrl } from '@worker/scraper/prisjakt/helpers';
	import ButtonLink from '../ButtonLink.svelte';
	import Button from '../Button.svelte';
  export let product: Product;
  let isPublishing = false;
  let isFetchingPrice = false;

  

</script>

<tr class="bg-white border-b text-gray-900">
  <td class="h-32 w-32">
    {#if product.thumbnail}
      <img src={`data:image/jpeg;base64,${product.thumbnail}`} class="object-contain" alt={product.originalName} />
    {:else}
    <div class="block mx-auto w-20 h-20 bg-gray-100"></div>
    {/if}
  </td>
  <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
    {product.originalName}
  </th>
  <td class="px-6 py-4">
    {product.originalPrice} kr / {product.discountedPrice} kr
  </td>
  <td class="px-6 py-4">
    {product.discount} kr / {product.discountPercent}%
  </td>
  <td class="px-6 py-4">
    {#if product.lowestPrice}
      {product.lowestPrice} kr
    {/if}
    {#if product.prisjaktUrl}
    <form method="POST" action="?/fetchFromPrisjakt" class="inline" use:enhance={() => {
      isFetchingPrice = true;
      return async ({ update }) => {
          isFetchingPrice = false;
          update();
      };
    }}>
      <input type="hidden" name="id" value={product.id} />
      <Button type='submit' isLoading={isFetchingPrice}>
        {#if product.lowestPrice}
          Update
        {:else}
          Fetch
        {/if}
      </Button>
    </form>
    {/if}
  </td>
  <td class="px-6 py-4">
    {#if product.lowestPrice}
      {product.lowestPrice - product.discountedPrice} kr / {calculateDiscountPercent(product.lowestPrice, product.discountedPrice)}%
    {/if}
  </td>
  <td class="px-6 py-4">
    <div class="flex flex-row gap-2">
      <ButtonLink href={`/edit/${product.id}`}>Edit</ButtonLink>
      <ButtonLink href={product.url} target='_blank'>View</ButtonLink>
      {#if product.publishedAt}
      <ButtonLink href={`https://www.finn.no/innfinn/adselection/ad/${product.finnId}`} target='_blank'>
        Finn-ad
      </ButtonLink>
      {:else}
      <form method="POST" action="?/publish" class="inline" use:enhance={() => {
        isPublishing = true;
        return async ({ update }) => {
            isPublishing = false;
            update();
        };
      }}>
        <input type="hidden" name="id" value={product.id} />
        <Button type='submit' isLoading={isPublishing}>
          Publish
        </Button>
      </form>
      {/if}
      {#if product.prisjaktUrl}
      <ButtonLink href={product.prisjaktUrl} target="blank">Prisjakt</ButtonLink>
      {:else}
      <ButtonLink href={buildPrisjaktSearchUrl(product)} target="blank">Prisjakt Søk</ButtonLink>
      {/if}
    </div>
  </td>
</tr>