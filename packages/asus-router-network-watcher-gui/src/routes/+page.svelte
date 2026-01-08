<script>
	import ProductTable from '@/components/ProductTable/Table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
    <title>Club Hustle - All</title> 
</svelte:head>

<ProductTable {data} />
