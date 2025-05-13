<template>
  <div
    class="band-card flex flex-col transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer"
    @click="ViewDetailsPage()"
  >
    <div class="image-container relative flex-grow overflow-hidden">
      <NuxtImg
        class="h-full w-full object-cover brightness-50"
        :src="bandPhoto"
        alt="bandName"
        width="320"
        height="320"
        loading="lazy"
      />
      <div class="absolute right-0 top-0 z-10 flex w-full justify-end p-3">
        <p class="text-s rounded px-2 py-1 font-bold uppercase text-white">
          {{ location }} <span v-if="time">-</span> {{ time }}
        </p>
      </div>
    </div>
    <p
      class="text-s w-full bg-black bg-opacity-50 p-2 font-bold uppercase text-white"
    >
      {{ bandName }}
    </p>
  </div>
</template>

<script>
export default defineNuxtComponent({
  props: {
    location: {
      type: String,
      required: true,
    },
    bandPhoto: {
      type: String,
      required: true,
    },
    bandName: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: false,
      default: null,
    },
    lookupName: {
      type: String,
      required: true,
    },
  },
  methods: {
    ViewDetailsPage() {
      this.$router.push(`/programma/${this.lookupName}`);
    },
  },
});
</script>

<style scoped>
.band-card {
  aspect-ratio: 1/1;
  width: 100%;
  overflow: hidden;
}

.image-container {
  flex-grow: 1;
}
</style>
