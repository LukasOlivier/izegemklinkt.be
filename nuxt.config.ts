import Aura from "@primeuix/themes/aura";

import { defineNuxtConfig } from "nuxt/config";
import bands from "./data/bands";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],

  // Nuxt Image module configuration
  image: {
    format: ["webp"],
    quality: 80,
  },

  // Nuxt SEO module configuration
  app: {
    head: {
      title: "Izegem Klinkt",
      titleTemplate: "%s - Izegem Klinkt",

      htmlAttrs: {
        lang: "nl",
      },

      link: [
        // Basic favicon
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

        // Standard sizes
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon-96x96.png",
        },

        // Apple devices
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },

        // Android devices
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/android-chrome-192x192.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/android-chrome-512x512.png",
        },

        // Web App Manifest
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },

  sitemap: {
    siteUrl: "https://www.izegemklinkt.be",
    generateOnBuild: true,
    urls: () => {
      // Get all bands from all years
      const bandPages = Object.values(bands).flatMap((yearBands) =>
        yearBands.map((band) => ({
          url: `/programma/${band.lookupName}`,
          changefreq: "yearly",
          priority: 0.8,
        })),
      );

      return [
        {
          url: "/",
          changefreq: "yearly",
          priority: 1,
        },
        {
          url: "/programma",
          changefreq: "yearly",
          priority: 0.9,
        },
        ...bandPages,
      ];
    },
  },

  site: {
    url: "https://www.izegemklinkt.be",
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },

  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-07-10",
});
