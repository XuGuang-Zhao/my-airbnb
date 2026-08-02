export default defineNuxtConfig({
  compatibilityDate: "2026-07-22",
  css: ["~/assets/css/main.css"],
  modules: ["@element-plus/nuxt"],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBase: "/api",
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: "1h",
  },
});
