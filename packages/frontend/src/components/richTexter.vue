<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

type Content = {
  component?: string | Component,
  text?: string,
  url?: string,
  class?: string | string[],
  attr?: Record<string, any>,
};

export type { Content as RichTexterContent };

const { contents } = defineProps<{
  contents: Content[]
}>();
</script>

<template>
  <template
    v-for="(content, idx) in contents"
    :key="idx"
  >
    <component
      v-if="content.component"
      :is="content.component"
      :class="Array.isArray(content.class) ? content.class.join(' ') : content.class"
      v-bind="content.attr"
    ></component>
    <NuxtLink
      v-else-if="content.url"
      :href="content.url"
      target="_blank"
      rel="noopener noreferrer"
      :class="Array.isArray(content.class) ? content.class.join(' ') : content.class"
      v-bind="content.attr"
    >{{ content.text }}</NuxtLink>
    <span
      v-else
      :class="Array.isArray(content.class) ? content.class.join(' ') : content.class"
      v-bind="content.attr"
    >{{ content.text }}</span>
  </template>
</template>