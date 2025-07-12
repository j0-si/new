<script setup lang="ts">
const providedUrl = ref('');

const frontendHost = import.meta.env.VITE_FRONTEND_HOST;

function shorten() {
  const url = providedUrl.value;


}
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center h-[calc(100dvh-7rem)]">
      <h1 class="mb-3 text-7xl max-sm:text-[12vmin] font-semibold text-shadow-[0_0_8px_white] mono">j0.si</h1>
      <form class="block justify-center text-base flex-wrap flex-col max-sm:w-full" @submit.prevent="shorten">
        <div class="flex flex-row max-sm:block m-2">
          <input type="url" pattern="https?://.+" placeholder="Enter a long url" class="w-[57vw] sm:rounded-e-none max-sm:w-full" v-model="providedUrl">
          <button class="sm:rounded-s-none max-sm:mt-2" type="submit">Shorten long url</button>
        </div>
        <details class="dropdown">
          <summary class="inline-block bg-slate-600 hover:bg-slate-500 active:bg-slate-700 m-2 mt-0 px-2 py-1 rounded-md border border-zinc-600 text-sm select-none after:inline-block after:border-4 after:border-b-0 after:border-white after:border-x-transparent after:align-[.16rem] after:ml-1">
            options
          </summary>
          <div>
            <div>{{ frontendHost }}</div>
          </div> 
        </details>
      </form>
    </div>
  </main>
</template>
<style scoped></style>