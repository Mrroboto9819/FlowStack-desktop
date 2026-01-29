<script>
  import { Play, Pause, RotateCcw, Timer } from "lucide-svelte";
  import { onMount } from "svelte";

  let {
    taskId,
    elapsedSeconds = 0,
    isRunning = false,
    onStart = () => {},
    onPause = () => {},
    onReset = () => {},
    compact = false,
  } = $props();

  let displaySeconds = $state(elapsedSeconds);
  let intervalId = $state(null);

  // Update display when elapsed seconds changes
  $effect(() => {
    displaySeconds = elapsedSeconds;
  });

  // Handle timer updates when running
  $effect(() => {
    if (isRunning) {
      intervalId = setInterval(() => {
        displaySeconds += 1;
      }, 1000);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function handleStart() {
    onStart(taskId);
  }

  function handlePause() {
    onPause(taskId, displaySeconds);
  }

  function handleReset() {
    onReset(taskId);
    displaySeconds = 0;
  }
</script>

{#if compact}
  <!-- Compact version for task cards -->
  <div class="flex items-center gap-1.5">
    <Timer size={10} class="text-muted-foreground" />
    <span class="text-[10px] font-mono text-muted-foreground">
      {formatTime(displaySeconds)}
    </span>
    {#if isRunning}
      <button
        type="button"
        class="rounded p-0.5 hover:bg-muted transition-colors"
        onclick={handlePause}
        title="Pause timer"
      >
        <Pause size={10} class="text-primary" />
      </button>
    {:else}
      <button
        type="button"
        class="rounded p-0.5 hover:bg-muted transition-colors"
        onclick={handleStart}
        title="Start timer"
      >
        <Play size={10} class="text-muted-foreground" />
      </button>
    {/if}
  </div>
{:else}
  <!-- Full version for detail modal -->
  <div class="space-y-3">
    <div class="flex items-center justify-center">
      <div class={`text-4xl font-mono font-bold ${isRunning ? "text-primary" : "text-foreground"}`}>
        {formatTime(displaySeconds)}
      </div>
    </div>

    <div class="flex items-center justify-center gap-2">
      {#if isRunning}
        <button
          type="button"
          class="btn btn-secondary px-4 py-2"
          onclick={handlePause}
        >
          <Pause size={16} />
          Pause
        </button>
      {:else}
        <button
          type="button"
          class="btn btn-primary px-4 py-2"
          onclick={handleStart}
        >
          <Play size={16} />
          Start
        </button>
      {/if}

      {#if displaySeconds > 0}
        <button
          type="button"
          class="btn btn-ghost px-4 py-2"
          onclick={handleReset}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      {/if}
    </div>
  </div>
{/if}
