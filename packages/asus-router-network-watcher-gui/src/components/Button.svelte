<script lang="ts">
	import Spinner from './Spinner.svelte';

  let type: 'button' | 'submit' = 'button';
  let className: string = '';
  export let isLoading: boolean = false;
</script>

<button {type} class={`${className} ${isLoading ? 'pointer-events-none relative' : ''} rounded bg-hustle-yellow px-2 py-1 text-sm font-semibold text-hustle-blue shadow-sm hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hustle-blue`} {...$$restProps}>
  <span class={`${isLoading ? 'invisible' : ''}`}>
    <slot />
  </span>
  <div class={`${isLoading ? 'absolute overflow-visible top-0 right-0 bottom-0 left-0 inline-flex items-center justify-center' : 'hidden'}`}>
    <Spinner />
  </div>
</button>