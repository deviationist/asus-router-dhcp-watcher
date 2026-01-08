<script>
  import '@/app.css';
	import Logo from '@/components/Logo.svelte';
  let open = false;
  import { page } from '$app/stores';
  const menuItems = [
    { name: 'All', href: '/' },
    { name: 'Published', href: '/published' },
    { name: 'Unpublished', href: '/unpublished' },
    { name: 'Deleted', href: '/deleted' },
  ];
</script>

<header class="bg-white">
  <nav class="mx-auto flex w-full items-center justify-between p-6 lg:px-8" aria-label="Global">
    <div class="flex items-center gap-x-12">
      <a href="/" class="-m-1.5 p-1.5">
        <Logo />
      </a>
      <div class="hidden lg:flex lg:gap-x-12">
        {#each menuItems as { name, href }}
        <a href={href} class="text-sm font-semibold leading-6 text-gray-900" class:underline={$page.url.pathname == href}>{name}</a>
        {/each}
      </div>
    </div>
    <div class="flex lg:hidden">
      <button type="button" on:click={() => open = true} class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
        <span class="sr-only">Open main menu</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  </nav>
  {#if open}
  <div class="lg:hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 z-10"></div>
    <div class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="flex items-center justify-between">
        <a href="/" class="-m-1.5 p-1.5">
          <Logo />
        </a>
        <button type="button" on:click={() => open = false} class="-m-2.5 rounded-md p-2.5 text-gray-700">
          <span class="sr-only">Close menu</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="space-y-2 py-6">
            {#each menuItems as { name, href }}
            <a href={href} class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" class:underline={$page.url.pathname == href}>{name}</a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
  {/if}
</header>

<div class="mx-auto w-full px-6 lg:px-8">
  <slot />
</div>