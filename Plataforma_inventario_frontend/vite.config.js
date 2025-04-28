import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    coverage: {
      provider: "istanbul",
      enabled: true, // usa istanbul para el coverage
      reporter: ["text", "html"], // texto en consola + html en coverage/
      reportsDirectory: "coverage",
      statements: 80, // umbral mínimo
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
