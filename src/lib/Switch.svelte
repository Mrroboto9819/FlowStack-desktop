<script>
  let { checked = $bindable(false), label = "", disabled = false, ...rest } = $props();
</script>

<label class="inline-flex cursor-pointer items-center gap-3 {disabled ? 'opacity-50' : ''}">
  <div class="relative">
    <input type="checkbox" class="peer sr-only" bind:checked {disabled} {...rest} />
    <div
      class="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-emerald-800"
    ></div>
  </div>
  {#if label}
    <span class="text-sm font-medium text-slate-700 dark:text-gray-300">{label}</span>
  {/if}
</label>
