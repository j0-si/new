<script setup lang="ts">
import type { RichTexterContent } from './richTexter.vue';

const { type, richText } = defineProps<{
  type: AlertType,
  richText?: RichTexterContent[],
}>()

export type AlertType = "success" | "error" | null;
export type Alert = {
  message?: string;
  type: AlertType;
  richText?: RichTexterContent[];
}
</script>

<template>
  <div :class="['alert', type && `alert-${type}`].join(' ')">
    <RichTexter v-if="richText" :contents="richText" />
    <slot v-else />
  </div>
</template>

<style scoped>
.alert {
  --alert-background: rgb(219, 219, 219);
  --alert-text: rgb(48, 48, 48);
  --alert-border: rgb(153, 153, 153);

  background: var(--alert-background);
  color: var(--alert-text);
  border: 1px solid var(--alert-border);

  display: inline-block;
  padding: .75rem 1.375rem;
  margin: .375rem;
  border-radius: .5rem;
  box-shadow: 0 0 16px color-mix(in srgb, var(--alert-border), transparent 36%);

  animation: alert-appear .64s var(--ease-out-quart);
  transition: .64s var(--ease-out-quart);
}

.alert-success {
  --alert-background: rgb(220, 255, 226);
  --alert-text: rgb(21, 68, 29);
  --alert-border: rgb(181, 247, 192);
}

.alert-error {
  --alert-background: rgb(255, 220, 220);
  --alert-text: rgb(68, 21, 21);
  --alert-border: rgb(247, 181, 181);
}
</style>