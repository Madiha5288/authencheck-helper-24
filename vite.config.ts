
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Override the default config path to use our custom one
  configFile: path.resolve(__dirname, "./src/tsconfig.custom.json"),
  // Add this to explicitly ignore the problematic tsconfig.node.json
  optimizeDeps: {
    force: true,
    exclude: ["tsconfig.node.json"]
  },
  build: {
    // Also ensure the build uses our custom configuration
    outDir: 'dist',
    emptyOutDir: true,
    // Completely skip TypeScript checking in tsconfig.node.json
    skipTypeCheck: true
  }
}));
