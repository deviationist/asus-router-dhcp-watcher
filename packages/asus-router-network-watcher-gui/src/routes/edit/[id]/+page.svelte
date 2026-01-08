<script>
  import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '@/components/Button.svelte';
  let isSaving = false;
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<form method="POST" action="?/updateProduct" use:enhance={() => {
  isSaving = true;
  return async ({ update }) => {
    isSaving = false;
    await update();
    await invalidateAll();
  };
}}>
  <div class="space-y-10">
    <h2 class="text-base font-semibold leading-7 text-gray-900">Product details</h2>
    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div class="sm:col-span-4">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Product name</label>
        <div class="mt-2">
          <input id="name" name="name" bind:value={data.name} type="text" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
        <p class="mt-1 text-sm leading-6 text-gray-600">Original name: {data.originalName}</p>
      </div>
      <div class="sm:col-span-4">
        <label for="prisjaktUrl" class="block text-sm font-medium leading-6 text-gray-900">Prisjakt URL</label>
        <div class="mt-2">
          <input id="prisjaktUrl" name="prisjaktUrl" bind:value={data.prisjaktUrl} type="text" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
      </div>
      <div class="sm:col-span-4">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div class="mt-2">
          <textarea bind:value={data.description} id="description" name="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div class="sm:col-span-4 border-t border-gray-900/10 pt-2">
        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
          <Button type="submit" isLoading={isSaving}>Save</Button>
        </div>
      </div>
    </div>
  </div>
</form>