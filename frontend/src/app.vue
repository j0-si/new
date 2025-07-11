<script setup lang="ts">
</script>

<template>
  <header>
    <div class="navbar-brand">
      <NuxtLink to="/" class="brand">j0.si</NuxtLink>
    </div>
    <nav>
      <NuxtLink to="/supporters">Supporters</NuxtLink>
    </nav>
  </header>
  <main>
    <NuxtPage />
  </main>
</template>

<style scoped>
header {
  width: 100vw;
  position: sticky;
  top:  0;
  left: 0;
  background: var(--color-navbar-background);
  box-shadow: 0 0 .64rem black;
  padding: .12rem 2.5rem;
  backdrop-filter: blur(8px);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  font-size: 18px;
}

.navbar-brand {
  display: flex;
  text-align: start;
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: .7rem;
  text-shadow: 0 0 5px var(--color-text);
  align-items: center;
  transition: 0.5s;
  & > a {
    padding: .1rem 1.2rem;
    color: var(--color-text);
  }
}

nav {
  text-align: end;
}

@media (hover: hover) {
  .navbar-brand:hover {
    text-shadow: 0 0 8px var(--color-text);
  }
}
</style>
