<script setup lang="ts">
import ToggleSwitch from '~/components/toggleSwitch.vue';

const api = useApi();

const providedUrl = ref('');
const customId = ref('');
const visitLimit = ref(0);
const isTemporary = ref(false);
const isCaseSensitive = ref(false);

const frontendHost = import.meta.env.VITE_FRONTEND_HOST;

async function shorten() {
  const url = providedUrl.value;
	const id = customId.value || null;
	const limit = visitLimit.value > 0 ? visitLimit.value : null;
	const temporary = isTemporary.value || false;
	const caseSensitive = isCaseSensitive.value || false;

  const response = await api('/shorten', {
    method: "POST",
    body: {
      id,
      url,
      accessLimit: limit,
      caseSensitive
    }
  })
}
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center h-[calc(100dvh-7rem)]">
      <h1 class="mb-3 text-7xl max-sm:text-[12vmin] font-semibold text-shadow-[0_0_8px_white] mono">j0.si</h1>
      <form class="flex justify-center text-base flex-wrap flex-col max-sm:w-full items-center" @submit.prevent="shorten">
        <div class="flex flex-row max-sm:block m-2">
          <input type="url" pattern="https?://.+" placeholder="Enter a long url" class="w-[57vw] sm:rounded-e-none max-sm:w-full" v-model="providedUrl">
          <button class="sm:rounded-s-none max-sm:mt-2" type="submit">Shorten long url</button>
        </div>
        <details class="options-button bg-(--color-background-tertialy)" open>
          <summary class="dropdown inline-block bg-slate-600 hover:bg-slate-500 active:bg-slate-700 px-2 py-1 rounded-md border border-zinc-600 text-sm select-none list-none after:inline-block after:border-4 after:border-b-0 after:border-white after:border-x-transparent after:align-[.16rem] after:ml-1">
            options
          </summary>
          <div class="details-content w-[54vw] text-nowrap">
            <div class="flex flex-row my-1">
              <div class="border border-(--color-border) bg-[#222333] p-1.5 pl-3 rounded-s-md select-none">{{ frontendHost }}/</div>
              <input type="text" pattern="^(?!\.)(?=.*[\p{L}\p{Nd}\-_\.]+)(?!.*\.{2,}).*$" placeholder="enter_a_custom_link_id" class="rounded-none max-sm:w-full rounded-e-md flex-auto pl-2" v-model="customId">
            </div>
            <div class="grid">
              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="limitAccess"
                >
                  Max number of accesses
                </label>
                <input
                  type="number" 
                  min="0" 
                  v-model="visitLimit" id="limitAccess"
                  class="text-sm text-end px-0 py-1 w-18"
                >
              </div>
              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="isTemporary"
                >
                  Temporary link
                </label>
                <ToggleSwitch v-model="isTemporary" />
              </div>
              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="isTemporary"
                >
                  Case sensitive
                </label>
                <ToggleSwitch v-model="isCaseSensitive" />
              </div>
            </div>
          </div>
        </details>
      </form>
    </div>
  </main>
</template>
<style scoped>
.options-button {
  transition: .64s var(--ease-out-expo) allow-discrete;
  border-radius: .375rem;

  &::details-content {
    transition: .64s var(--ease-out-expo) allow-discrete;
    transform-origin: top left;
    position: relative;
  }

  &:open {
    padding: 5px;
    border-radius: calc(.375rem + 5px);
  }
  &:not(:open)::details-content {
    width: 0;
    height: 0;
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
  }
  &:open::details-content {
    width: auto;
    height: auto;
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
  }
  &:open > summary {
    margin-bottom: 5px;
  }
}

.options-button .details-content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.5s var(--ease-out-quart), opacity 0.5s var(--ease-out-quart);
}

.options-button[open] .details-content {
  max-height: 500px; /* adjust as needed */
  opacity: 1;
}
</style>