<script lang="ts">
  let type: 'button' | 'submit' = 'button';
  let target: '_blank' | '_self' = '_self';
  let href: string = '';
  let className: string = '';
</script>

<a {target} {href} {type} class={`${className} rounded bg-hustle-yellow px-2 py-1 text-sm font-semibold text-hustle-blue shadow-sm hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hustle-blue`} {...$$restProps}>
  <slot />
</a>