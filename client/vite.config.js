import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  // proxy: {
  //   "/api": "https://devspace-7owc.onrender.com",
  // },
  // },
  plugins: [react()],
});
