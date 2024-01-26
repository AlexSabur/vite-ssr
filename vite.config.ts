import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vavite } from "vavite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  buildSteps: [
    {
      name: "client",
      config: {
        build: {
          outDir: "dist/client",
          manifest: true,
        },
      },
    },
    {
      name: "server",
      config: {
        build: {
          ssr: true,
          outDir: "dist/server",
          target: "node18",
        },
      },
    },
  ],
  ssr: { noExternal: ['@softmg/effector-react-form'] },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [
          ["effector/babel-plugin", { addLoc: true }],
          "@emotion/babel-plugin",
        ],
      },
    }),
    vavite({
      serverEntry: "/server.ts",
      serveClientAssetsInDev: true,
      // Don't reload when dynamically imported dependencies change
      reloadOn: "static-deps-change",
    }),
  ],
}));
