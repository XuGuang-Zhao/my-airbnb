export default defineNuxtConfig({
  compatibilityDate: "2026-07-22",
  css: ["~/assets/css/main.css"],
  modules: ["@element-plus/nuxt"],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBase: "/api",
    },
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    SESSION_MAX_DAYS: process.env.SESSION_MAX_DAYS,
  },
});
