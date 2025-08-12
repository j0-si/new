<script setup lang="ts">
const api = useApi();
const route = useRoute();

interface LinkData {
  error: boolean;
  id: string;
  idLowercase: string;
  url: string,
  caseSensitive: boolean;
  expiresAt?: Date;
  accessLimit?: number;
}

const id = route.params.id.toString().replace(/\+$/, '');
const isSuffixPlus = route.params.id.toString().endsWith('+')

async function getLinkData(id: string): Promise<LinkData>  {
  return await api(`/link/${id}`, {
    method: "GET"
  })
}

const data = await getLinkData(id)

if (data.error) {
  throw createError({
    statusCode: 404,
    statusMessage: "Link not found",
    data: {
      link: true,
    }
  })
}

if (!isSuffixPlus) {
  await navigateTo(data.url, {
    external: true
  });
}
</script>
<template>
  <div class="grid items-center justify-center w-screen min-h-screen">

    <div>
      <p>
        Original URL:
        <NuxtLink :to="data.url">{{ data.url }}</NuxtLink>
      </p>
    </div>

  </div>
</template>