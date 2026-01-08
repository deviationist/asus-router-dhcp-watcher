<script>
	import Row from './Row.svelte';
  export let data;
</script>

{#if data.products.length === 0}
  <div class="text-hustle-blue">
    No products found
  </div>
{:else}
<div class="relative overflow-x-auto">
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th></th>
        <th scope="col" class="px-6 py-3">
          Name
        </th>
        <th scope="col" class="px-6 py-3">
          Original / club price
        </th>
        <th scope="col" class="px-6 py-3">
          Club discount
        </th>
        <th scope="col" class="px-6 py-3">
          Lowest price
        </th>
        <th scope="col" class="px-6 py-3">
          Lowest price discount
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each data.products as product}
        <Row {product} />
      {/each}

    </tbody>
  </table>
</div>
{/if}