import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { md2 } from "vuetify/blueprints";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    blueprint: md2,

    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },

    ssr: !!nuxtApp.ssrContext,
  });
  nuxtApp.vueApp.use(vuetify);
});
