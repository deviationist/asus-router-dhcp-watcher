<script>
	import ProductTable from '@/components/ProductTable/Table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
    <title>Club Hustle - Published</title> 
</svelte:head>

<ProductTable {data} />
