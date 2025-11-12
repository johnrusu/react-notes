import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createHtmlPlugin } from "vite-plugin-html";

// App metadata configuration
const appMetadata = {
  title: "Rusu Ionut - Notes",
  author: "Rusu Ionut",
  description:
    "A modern, feature-rich notes application built with React, Redux, Material-UI, and TailwindCSS. Features drag-and-drop organization, text search, note highlighting, dark/light mode, responsive design, and localStorage persistence with auto-clear timer.",
  keywords:
    "notes app, react, redux, material-ui, tailwindcss, typescript, drag and drop, dark mode, ionut rusu, note taking, productivity",
};

// https://vite.dev/config/
export default defineConfig({
  base: "/react-notes/", // GitHub Pages repository name
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          ...appMetadata,
        },
      },
    }),
  ],
});
