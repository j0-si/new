<script setup lang="ts">
import dayjs from 'dayjs';
import ToggleSwitch from '~/components/toggleSwitch.vue';
import type { Alert } from '~/components/alertPopup.vue';
import type { LinkData } from '~/types/link';

const api = useApi();
const runtimeConfig = useRuntimeConfig()

const providedUrl = ref('');
const customId = ref('');
const visitLimit = ref(0);
const expiresIn = ref<number>(0);
const expiresAt = ref<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
const isCaseSensitive = ref(true);
const expireDateType = ref("after");
const expiresAtMin = ref("")
const expiresAfterCustom = ref(false)

const expiresAtInputElement = ref(null)

const serviceName = runtimeConfig.public.serviceName;
const frontendHost = runtimeConfig.public.frontendHost;

const { alerts, setAlerts } = inject<{
  alerts: Ref<Alert[]>,
  setAlerts: Function,
}>('alerts', {
  alerts: ref([]),
  setAlerts: () => {},
});

async function shorten() {
  const url = providedUrl.value;
	const id = customId.value || null;
	const limit = visitLimit.value > 0 ? visitLimit.value : null;
	const caseSensitive = isCaseSensitive.value || false;

  const expiresData: {
    expiresAt?: Date,
    expiresIn?: number,
  } = {}

  if (expireDateType.value === "after") {
    const expiresInFinalized = expiresIn.value > 0 ? expiresIn.value : undefined;

    if (expiresInFinalized) {
      expiresData.expiresIn = expiresInFinalized * 1e3
    }
  } else if (expireDateType.value === "at") {
    const expiresAtDate = new Date(expiresAt.value)
    
    if (
      expiresAt.value &&
      expiresAtDate.getTime() < Date.now()
    ) {
      return;
    }

    expiresData.expiresAt = expiresAtDate
  }

  const linkResponse: {
    error: string | false;
    detail?: {
      name: string;
      message: string;
    }
    link?: LinkData | undefined;
  } = await api('/shorten', {
    method: "POST",
    body: {
      id,
      url,
      accessLimit: limit,
      caseSensitive,
      ...expiresData,
    }
  })

  if (linkResponse.error) {
    setAlerts([
      ...alerts.value.slice(-3),  
      {
        type: "error",
        richText: [
          {
            text: "Error: " + linkResponse.error
          },
        ],
      }
    ])
    
    return;
  }

  if (!linkResponse.link) {
    setAlerts([
      ...alerts.value.slice(-3),  
      {
        type: "error",
        richText: [
          {
            text: "Something went wrong: Link not found in the response"
          },
        ],
      }
    ])
    
    return;
  }

  const link: LinkData = linkResponse.link;

  setAlerts([
    ...alerts.value.slice(-3),  
    {
      type: "success",
      richText: [
        {
          text: "URL Shortened! "
        },
        {
          url: new URL(link.id, frontendHost).href,
          text: new URL(link.id, frontendHost).href,
          class: "blue"
        },
      ],
    }
  ])
}

watch(expireDateType, (newType, oldType) => {
  // only when "at" was selected
  if (newType === oldType || newType !== "at") return;

  // if there was already a value, skip
  if (expiresAt.value) return;

  expiresAt.value = dayjs().format('YYYY-MM-DDTHH:mm')
})

watch(customId, (newCustomId) => {
  // force caseSensitive if no ID is provided
  if (!newCustomId) {
    isCaseSensitive.value = true
  }
})

onMounted(() => {
  
  setExpiresAtMinValue()

  setTimeout(() => {
    setInterval(setExpiresAtMinValue, 60_000)
  }, 60_000 - (Date.now() % 60_000))
  
  function setExpiresAtMinValue(){
    expiresAtMin.value = dayjs().format('YYYY-MM-DDTHH:mm')
  }

})
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center min-h-[calc(100dvh-7rem)]">
      <h1 class="mb-3 text-7xl max-sm:text-[12vmin] font-semibold text-shadow-[0_0_8px_white] mono">
        {{ serviceName }}
      </h1>

      <form class="flex justify-center text-base flex-wrap flex-col max-sm:w-full items-center" @submit.prevent="shorten">

        <div class="flex flex-row max-sm:block max-sm:w-full p-2">
          <input
            type="url" 
            pattern="https?://.+" 
            placeholder="Enter a long url" 
            class="w-[57vw] sm:rounded-e-none max-sm:w-full" 
            v-model="providedUrl"
            required
          >
          <button
            class="sm:rounded-s-none max-sm:mt-2" 
            type="submit"
          >Shorten long url</button>
        </div>

        <details class="options-button bg-(--color-background-tertialy) open:w-full open:min-w-70 md:open:w-143" open>
          <summary class="dropdown inline-block bg-slate-600 hover:bg-slate-500 active:bg-slate-700 px-2 py-1 rounded-md border border-zinc-600 text-sm select-none list-none after:inline-block after:border-4 after:border-b-0 after:border-white after:border-x-transparent after:align-[.16rem] after:ml-1">
            options
          </summary>

          <div class="details-content w-full text-nowrap transition duration-160">
            
            <div class="flex flex-row my-1">
              <div class="border border-(--color-border) bg-[#222333] p-1.5 pl-3 rounded-s-md select-none">{{ frontendHost }}/</div>
              <input type="text" pattern="^(?!\.)(?=.*[\p{L}\p{Nd}\-_\.]+)(?!.*\.{2,}).*$" placeholder="enter_a_custom_link_id" class="rounded-none max-sm:w-full rounded-e-md flex-auto pl-2" v-model="customId">
            </div>

            <div class="grid">

              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="isCaseSensitive"
                  class="content-center"
                >
                  Case sensitive
                </label>
                <ToggleSwitch
                  v-model="isCaseSensitive" 
                  id="isCaseSensitive"
                  checked
                  :disabled="!customId"
                />
              </div>
              
              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="limitAccess"
                  class="content-center max-sm:flex max-sm:flex-col text-start"
                >
                  Max number of accesses <small>
                    (0 = unlimited)
                  </small>
                </label>
                <input
                  type="number" 
                  min="0"
                  :max="2 ** 31 - 1"
                  v-model="visitLimit" id="limitAccess"
                  class="text-sm text-end px-2 py-1 w-26 h-fit"
                >
              </div>

              <div class="flex flex-row justify-between mx-2 my-1">
                <label
                  for="expires"
                  class="content-center"
                >
                  Expires <select v-model="expireDateType">
                    <option selected value="after">after</option>
                    <option value="at">at</option>
                  </select>
                </label>

                <!-- after -->
                <div v-if="expireDateType === 'after'" class="flex items-center">
                  <div class="">
                    <label
                      for="expiresAfterCustom"
                      class="content-center"
                    >
                      Custom
                    </label>
                    <ToggleSwitch
                      v-model="expiresAfterCustom" 
                      id="expiresAfterCustom"
                    />
                  </div>

                  <div v-if="expiresAfterCustom" class="expires-custom">
                    <input
                      v-model="expiresIn"
                      class="text-sm text-end w-32 px-2 py-1 expires-custom-input"
                      id="expires"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div v-else>
                    <select
                      class="text-sm text-end w-32 px-2 py-1 input"
                      v-model="expiresIn"
                    >
                      <option :value="0" selected>Never</option>
                      <option :value="30 * 60 * 1e3">30 minutes</option>
                      <option :value="60 * 60 * 1e3">1 hour</option>
                      <option :value="3 * 60 * 60 * 1e3">3 hours</option>
                      <option :value="6 * 60 * 60 * 1e3">6 hours</option>
                      <option :value="12 * 60 * 60 * 1e3">12 hours</option>
                      <option :value="24 * 60 * 60 * 1e3">1 day</option>
                      <option :value="3 * 24 * 60 * 60 * 1e3">3 days</option>
                      <option :value="7 * 24 * 60 * 60 * 1e3">7 days</option>
                      <option :value="expiresIn" disabled>Custom</option>
                    </select>
                  </div>

                </div>

                <!-- at -->
                <input
                  v-if="expireDateType === 'at'"
                  v-model="expiresAt"
                  ref="expiresAtInputElement"
                  class="text-sm text-end w-44 px-2 py-1"
                  id="expires"
                  type="datetime-local"
                  :min="expiresAtMin"
                />
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
    transform: scale(0.5);
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

.expires-custom {
  display: inline-block;
  position: relative;

  &::after {
    position: absolute;
    content: "ms";
    font-family: var(--font-default);
    font-size: var(--text-sm);
    color: black;
    inset: 0 1.5rem 0 auto;
    line-height: 2.125;
  }
}

.expires-custom-input::-webkit-inner-spin-button,
.expires-custom-input::-webkit-inner-spin-button {
  margin-left: 1.375rem;
}
</style>