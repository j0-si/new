<script setup lang="ts">
import supporters from '~/data/supporters';
</script>

<template>
  <main>
    <h1>Supporters</h1>
    <p>
      <small class="text-gray-400">even a dollar makes me happy.</small>
    </p>
    <ul class="supporter-list">
      <li v-for="supporter in supporters">
        {{ supporter.name }}
        <NuxtLink
          v-if="supporter.url"
          :to="supporter.url"
          class="link-icon"
          target="_blank"
        >
          <Icon name="tabler:link" size="28" />
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style>
.supporter-list {
  font-size: 20px;
  list-style: none;
  padding: 0;
  margin: 8px;
}

.supporter-list > li {
  user-select: none;
  padding: 3px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.link-icon {
  cursor: pointer;
  padding: .25rem;
  line-height: 0;
}
</style>
