import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280, // Anchura del viewport
    viewportHeight: 900, // Altura del viewport
  },
});
