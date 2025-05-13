<template>
  <div>
    <PageHeader />
    <HamburgerMenu />
    <div class="mx-auto flex w-9/12 flex-col">
      <h1 class="mb-10 mt-20 text-5xl font-bold text-white">Programma</h1>
      <a class="underline" target="_blank" href="/BOEKJE-IZEGEMKLINKT-2025.pdf">
        <h2 class="mb-10 text-2xl font-bold text-white">
          Download hier het programmaboekje
        </h2>
      </a>

      <!-- Year tabs - Only show if we have bands -->
      <div
        v-if="Object.keys(bands).length > 0 && !isLoading"
        class="mb-8 border-b border-gray-200"
      >
        <ul class="-mb-px flex flex-wrap text-center text-sm font-medium">
          <li v-for="year in years" :key="year" class="mr-2">
            <button
              class="inline-block rounded-t-lg p-4"
              :class="[
                selectedYear === year
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:border-gray-300 hover:text-gray-300',
              ]"
              @click="selectedYear = year"
            >
              <p class="font-semibold text-white">{{ year }}</p>
            </button>
          </li>
        </ul>
      </div>

      <!-- Band cards with transition -->
      <transition name="fade-slide" mode="out-in">
        <div
          v-if="bands[selectedYear]?.length > 0"
          :key="selectedYear"
          class="mx-auto grid w-full grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <div
            v-for="lineUpItem in bands[selectedYear]"
            :key="lineUpItem.lookupName"
            class="flex w-full justify-center"
          >
            <div class="w-full max-w-xs">
              <BandCard
                :location="lineUpItem.location"
                :band-photo="lineUpItem.bandPhoto"
                :band-name="lineUpItem.bandName"
                :time="lineUpItem.time"
                :lookup-name="lineUpItem.lookupName"
              />
            </div>
          </div>
        </div>
        <div v-else-if="isLoading" key="loading" class="min-h-64">
          <p class="w-full text-center text-2xl font-semibold text-white">
            Bands ophalen...
          </p>
        </div>
        <div v-else-if="hasError" key="error" class="min-h-64">
          <p class="w-full text-center text-2xl font-semibold text-white">
            Er is een probleem opgetreden bij het laden van de bands.
          </p>
        </div>
        <div v-else key="no-bands" class="min-h-64">
          <p class="w-full text-center text-2xl font-semibold text-white">
            Geen bands gevonden voor {{ selectedYear }}.
          </p>
        </div>
      </transition>
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
const bands = ref({});
const years = computed(() => Object.keys(bands.value).sort().reverse());
const selectedYear = ref("");
const isLoading = ref(true);
const hasError = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const fetchedBands = await useBands();

    // Only update bands if we actually got data
    if (fetchedBands && Object.keys(fetchedBands).length > 0) {
      bands.value = fetchedBands;
      // Set default selected year to the most recent one
      if (years.value.length > 0) {
        selectedYear.value = years.value[0];
      }
    } else {
      console.error("No bands data returned from useBands()");
      hasError.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch bands:", error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "Programma",
  meta: [
    {
      name: "description",
      content:
        "Ontdek het volledige programma van Izegem Klinkt. Bekijk alle bands, podia en speeltijden van het festival.",
    },
    {
      name: "keywords",
      content:
        "Izegem Klinkt, festival programma, line-up, bands, muziekfestival, Izegem",
    },
    {
      property: "og:title",
      content: "Programma | Izegem Klinkt",
    },
    {
      property: "og:description",
      content:
        "Ontdek het volledige programma van Izegem Klinkt. Bekijk alle bands, podia en speeltijden van het festival.",
    },
  ],
  link: [{ rel: "canonical", href: "https://www.izegemklinkt.be/programma" }],
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
