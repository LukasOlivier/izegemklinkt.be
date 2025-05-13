<template>
  <div>
    <NuxtLayout>
      <Analytics />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
</script>
