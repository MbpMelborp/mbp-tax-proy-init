<script setup>
const links = [
  {
    label: "Features",
    to: "#features",
    exactHash: true,
  },
  {
    label: "Documentation",
    to: "https://ui.nuxt.com/pro",
    target: "_blank",
  },
];
const colorMode = useColorMode();

const color = computed(() => (colorMode.value === "dark" ? "#111827" : "white"));

useHead({
  htmlAttrs: {
    lang: "es",
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    {
      rel: "stylesheet",
      href: "https://kit.fontawesome.com/6328404de0.css",
      crossorigin: "anonymous",
    },
  ],
  bodyAttrs: {
    // class:
    //   // "bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-50" +
    //   process.env.NODE_ENV === "development" ? " debug-screens" : "",
  },
});

const title = "Melborp DCO";
const description =
  "Esta aplicación es un proyecto inicial de Melborp DCO que utiliza Nuxt UI Pro para crear aplicaciones Nuxt hermosas y responsivas en minutos.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui-pro-starter.nuxt.dev/social-card.png",
  twitterImage: "https://ui-pro-starter.nuxt.dev/social-card.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
  <UModals />
</template>

<style lang="postcss">
:root {
  --radius: 0.6rem;

  /* --color-gray-50: 247 246 245;
  --color-gray-100: 237 235 231;
  --color-gray-200: 226 223 218;
  --color-gray-300: 193 187 176;
  --color-gray-400: 167 156 144;
  --color-gray-500: 150 136 121;
  --color-gray-600: 137 122 109;
  --color-gray-700: 114 100 92;
  --color-gray-800: 94 83 78;
  --color-gray-900: 78 69 64;
  --color-gray-950: 41 36 33;
  --color-gray-DEFAULT: var(--color-gray-800);

  --color-primary-50: 246 246 246;
  --color-primary-100: 240 240 240;
  --color-primary-200: 235 235 235;
  --color-primary-300: 187 187 187;
  --color-primary-400: 135 135 135;
  --color-primary-500: 84 84 84;
  --color-primary-600: 76 76 76;
  --color-primary-700: 60 60 60;
  --color-primary-800: 50 50 50;
  --color-primary-900: 25 25 25;
  --color-primary-950: 3 7 18;
  &.dark {
    --color-primary-DEFAULT: var(--color-primary-200) !important;
  } */
}
.firebase-emulator-warning {
  @apply opacity-10;
}
.testpre {
  @apply prose overflow-auto bg-black text-xs text-lime-400;
}
body {
  @apply font-sans antialiased;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-display tracking-tighter;
  }
}
</style>
