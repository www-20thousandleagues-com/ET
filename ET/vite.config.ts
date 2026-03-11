import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router-dom") || id.includes("@remix-run") || id.includes("react-router")) {
              return "router";
            }
            if (id.includes("@supabase")) {
              return "supabase";
            }
            if (id.includes("lucide-react")) {
              return "ui";
            }
            if (id.includes("react-dom") || id.includes("/react/")) {
              return "vendor";
            }
          }
        },
      },
    },
  },
});
