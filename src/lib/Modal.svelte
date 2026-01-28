<script>
  import { X } from "lucide-svelte";
  let {
    open = false,
    title = "Modal",
    size = "md",
    onClose = () => {},
  } = $props();

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <button
      type="button"
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      aria-label="Close modal"
      onclick={onClose}
    ></button>
    <div
      class={`relative z-10 flex w-full flex-col ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl`}
    >
      <header
        class="flex flex-none items-center justify-between border-b border-slate-100 px-5 py-4"
      >
        <h2
          class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          {title}
        </h2>
        <button
          type="button"
          class="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          onclick={onClose}
        >
          <X size={18} />
        </button>
      </header>
      <div class="overflow-y-auto px-5 py-4">
        <slot />
      </div>
      <footer class="flex-none border-t border-slate-100 px-5 py-4">
        <slot name="footer" />
      </footer>
    </div>
  </div>
{/if}
