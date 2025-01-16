// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  extends: ["@nuxt/ui-pro"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/content",
    "@nuxt/image",
    "nuxt-vuefire",
    "nuxt-svgo",
    "@formkit/auto-animate/nuxt",
    "@morev/vue-transitions/nuxt",
    "@hypernym/nuxt-gsap",
  ],
  // components: [
  //   {
  //     path: "./app/components",
  //     // pathPrefix: false,
  //   },
  // ],
  plugins: ["~/plugins/color.client.ts", "~/plugins/media.client.ts"],
  ui: {
    safelistColors: ["amber", "red", "orange", "green"],
    global: true,
  },
  devtools: {
    enabled: true,
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    // "/": { prerender: true },
    "/api/__session": { ssr: false }, // Add this line
  },

  future: {
    compatibilityVersion: 4,
  },
  imports: {
    dirs: ["types/*.ts"],
  },
  compatibilityDate: "2024-07-11",
  eslint: {},
  svgo: {
    autoImportPath: "./assets/svgs/",
    defaultImport: "component",
  },
  fonts: {
    // You can provide overrides for individual families
    families: [
      {
        name: "DM Sans",
        provider: "google",
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        styles: ["normal", "italic"],
      },
      {
        name: "Inter",
        provider: "google",
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        styles: ["normal", "italic"],
      },
      {
        name: "JetBrains Mono",
        provider: "google",
        weights: [100, 200, 300, 400, 500, 600, 700, 800],
        styles: ["normal", "italic"],
      },
    ],
  },
  vuefire: {
    auth: {
      // enabled: true,
      // ssr: true,
      sessionCookie: true,
      enabled: true,
    },
    config: {
      apiKey: "AIzaSyDfjf-e5_aqbAeFx-QPHeN5D3Gna-EfZ4M",
      authDomain: "mbp-ai.firebaseapp.com",
      projectId: "mbp-ai",
      storageBucket: "mbp-ai.appspot.com",
      messagingSenderId: "63307906837",
      appId: "1:63307906837:web:c8b9df207d4767be9bf31c",
      measurementId: "G-EMQ15EBB9K",
      // there could be other properties depending on the project
    },
  },
  vite: {
    server: {
      watch: {
        ignored: [
          "functions/**",
          "functions-py/**",
          "firebase-seed/**",
          "firebase-seed/**",
          "venv/**",
          ".firebase",
        ],
      },
    },
  },
  nitro: {
    // prerender: {
    //   // these routes are not dependent on any data and can be prerendered
    //   // it's a good idea to pre render all routes that you can
    //   // routes: ["/", "/analytics"],
    //   // ignore: ["/"],
    // },
    // preset: "firebase",
    // preset: "vercel-edge",
    // for the upcoming preset
    firebase: {
      gen: 2,
      nodeVersion: "18",
    },
  },
});
