<script>
	import ProductTable from '@/components/ProductTable/Table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
    <title>Club Hustle - Unpublished</title> 
</svelte:head>

<ProductTable {data} />
