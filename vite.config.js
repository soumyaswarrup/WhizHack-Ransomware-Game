import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        hacked: resolve(__dirname, "hacked.html"),
        leaderboard: resolve(__dirname, "leaderboard.html"),
        login: resolve(__dirname, "login.html"),
        cong: resolve(__dirname, "cong.html"),
        privacy: resolve(__dirname, "privacypolicy.html"),
        terms: resolve(__dirname, "termsandcondition.html"),
      },
    },
  },
  publicDir: 'public', // Ensure this is set to 'public'
});