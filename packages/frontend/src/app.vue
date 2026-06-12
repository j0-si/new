<script setup lang="ts">
import type { Alert } from './components/alertPopup.vue';

const alerts = ref<Alert[]>([]);

function setAlerts(newValue: Alert[]) {
  alerts.value = newValue;
}

provide("alerts", { alerts, setAlerts })


</script>

<template>
  <NuxtLayout>
    <div class="w-full grid justify-items-center">
      <div class="grid fixed z-128">
        <AlertPopup
          v-for="alert in alerts"
          :type="alert.type"
          :richText="alert.richText"
        >
          {{ alert.message }}
        </AlertPopup>
      </div>
    </div>

    <NuxtPage />

  </NuxtLayout>
</template>

