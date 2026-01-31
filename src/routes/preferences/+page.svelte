<script lang="ts">
  import {
    SlidersHorizontal,
    Sun,
    Moon,
    Palette,
    Trash2,
    User,
    AlertTriangle,
    Globe,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import ConfirmModal from "../../lib/components/ConfirmModal.svelte";
  import { currentUserStore, themeStore } from "../../lib/stores/index.js";
  import { _, locale, supportedLocales, setLocale } from "$lib/i18n";

  let darkMode = $state(true);
  let userName = $state(currentUserStore.name);
  let themeColor = $state(themeStore.current);
  let confirmClearDataOpen = $state(false);

  const themeColors = [
    { name: "emerald", value: "#10b981", label: "Emerald" },
    { name: "blue", value: "#3b82f6", label: "Blue" },
    { name: "violet", value: "#8b5cf6", label: "Violet" },
    { name: "rose", value: "#f43f5e", label: "Rose" },
    { name: "amber", value: "#f59e0b", label: "Amber" },
    { name: "cyan", value: "#06b6d4", label: "Cyan" },
  ];

  onMount(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      darkMode = savedDarkMode === "true";
    }

    // Sync stores if they changed elsewhere (e.g. initial load)
    userName = currentUserStore.name;
    themeColor = themeStore.current;
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode.toString());

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }

  function saveUserName() {
    currentUserStore.setName(userName);
  }

  function handleThemeChange(themeName: string) {
    themeColor = themeName;
    themeStore.setTheme(themeName);
  }

  function confirmClearData() {
    confirmClearDataOpen = true;
  }

  function handleClearData() {
    // Clear all localStorage except theme preferences and language
    const keysToKeep = ["darkMode", "themeColor", "userName", "taskflow_locale"];
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Reload the page to reset stores
    window.location.reload();
  }
</script>

<main class="w-full px-6 pt-6 pb-10">
  <!-- Header -->
  <header class="mb-6">
    <div class="flex items-center gap-3 mb-2">
      <div class="rounded-xl bg-primary/10 border border-primary/30 p-2.5">
        <SlidersHorizontal size={24} class="text-primary" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-foreground">{$_("preferences.title")}</h1>
        <p class="text-muted-foreground mt-1">
          {$_("preferences.description")}
        </p>
      </div>
    </div>
  </header>

  <div class="space-y-6 max-w-3xl">
    <!-- User Profile Section -->
    <section class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <User size={20} class="text-primary" />
        <h2 class="text-lg font-semibold text-foreground">{$_("preferences.userProfile.title")}</h2>
      </div>

      <div>
        <label
          for="user-name-input"
          class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {$_("preferences.userProfile.displayName")}
        </label>
        <div class="mt-2 flex gap-3">
          <input
            id="user-name-input"
            type="text"
            class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            bind:value={userName}
            placeholder={$_("preferences.userProfile.placeholder")}
          />
          <button type="button" class="btn btn-primary" onclick={saveUserName}>
            {$_("common.save")}
          </button>
        </div>
      </div>
    </section>

    <!-- Appearance Section -->
    <section class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <Palette size={20} class="text-primary" />
        <h2 class="text-lg font-semibold text-foreground">{$_("preferences.appearance.title")}</h2>
      </div>

      <div class="space-y-4">
        <!-- Dark Mode Toggle -->
        <div
          class="flex items-center justify-between p-4 rounded-lg bg-muted/30"
        >
          <div class="flex items-center gap-3">
            {#if darkMode}
              <Moon size={20} class="text-foreground" />
            {:else}
              <Sun size={20} class="text-foreground" />
            {/if}
            <div>
              <p class="text-sm font-semibold text-foreground">{$_("preferences.appearance.darkMode")}</p>
              <p class="text-xs text-muted-foreground">
                {$_("preferences.appearance.darkModeDescription")}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Toggle dark mode"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {darkMode
              ? 'bg-primary'
              : 'bg-muted'}"
            onclick={toggleDarkMode}
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {darkMode
                ? 'translate-x-6'
                : 'translate-x-1'}"
            ></span>
          </button>
        </div>

        <!-- Theme Color Picker -->
        <div class="p-4 rounded-lg bg-muted/30">
          <p class="text-sm font-semibold text-foreground mb-3">{$_("preferences.appearance.themeColor")}</p>
          <div class="grid grid-cols-3 gap-3">
            {#each themeColors as theme}
              <button
                type="button"
                class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all {themeColor ===
                theme.name
                  ? 'border-foreground bg-muted/50'
                  : 'border-border hover:border-muted-foreground'}"
                onclick={() => handleThemeChange(theme.name)}
              >
                <div
                  class="w-6 h-6 rounded-full"
                  style="background-color: {theme.value}"
                ></div>
                <span class="text-sm font-medium text-foreground"
                  >{theme.label}</span
                >
              </button>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Language Section -->
    <section class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <Globe size={20} class="text-primary" />
        <h2 class="text-lg font-semibold text-foreground">{$_("preferences.language.title")}</h2>
      </div>

      <div class="p-4 rounded-lg bg-muted/30">
        <p class="text-sm text-muted-foreground mb-3">{$_("preferences.language.description")}</p>
        <div class="grid grid-cols-2 gap-3">
          {#each supportedLocales as lang}
            <button
              type="button"
              class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all {$locale === lang.code
                ? 'border-foreground bg-muted/50'
                : 'border-border hover:border-muted-foreground'}"
              onclick={() => setLocale(lang.code)}
            >
              <img src={lang.flag} alt={lang.name} class="w-6 h-5 object-cover rounded-sm" />
              <span class="text-sm font-medium text-foreground">{lang.name}</span>
            </button>
          {/each}
        </div>
      </div>
    </section>

    <!-- App Information -->
    <section class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-foreground mb-4">{$_("preferences.about.title")}</h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">{$_("preferences.about.version")}</span>
          <span class="text-foreground font-medium">2.1.4</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">{$_("preferences.about.storageUsed")}</span>
          <span class="text-foreground font-medium">
            {Math.round(JSON.stringify(localStorage).length / 1024)} KB
          </span>
        </div>
      </div>
    </section>

    <!-- Data Management Section -->
    <section class="rounded-xl border border-border/50 bg-card/50 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Trash2 size={14} class="text-muted-foreground" />
          <span class="text-sm text-muted-foreground">{$_("preferences.dataManagement.title")}</span>
        </div>
        <button
          type="button"
          class="text-xs text-rose-500 hover:text-rose-600 hover:underline transition-colors"
          onclick={confirmClearData}
        >
          {$_("preferences.dataManagement.clearData")}
        </button>
      </div>
    </section>
  </div>
</main>

<!-- Confirm Clear Data Modal -->
<ConfirmModal
  bind:open={confirmClearDataOpen}
  title={$_("preferences.dataManagement.clearData")}
  message={$_("preferences.dataManagement.confirmClear")}
  confirmText={$_("preferences.dataManagement.clearData")}
  cancelText={$_("common.cancel")}
  variant="danger"
  onConfirm={handleClearData}
/>
