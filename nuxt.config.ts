import vuetify from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "vuetify/styles",
    // "@mdi/font/css/materialdesignicons.css",
    "@/style.css",
  ],
  typescript: {
    strict: true,
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins?.push(vuetify());
      });
    },
    "@nuxtjs/web-vitals",
  ],
});
