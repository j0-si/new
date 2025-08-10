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

/*
  todo: fetch backend /link/[id]
  - redirect based on fetch result
*/

async function getLinkData(id: string): Promise<LinkData>  {
  return await api(`/link/${id}`, {
    method: "GET"
  })
}

const data = await getLinkData(route.params.id.toString())

if (data.error) {
  throw createError({
    statusCode: 404,
    statusMessage: "Link not found",
    data: {
      link: true,
    }
  })
}

await navigateTo(data.url, {
  external: true
});
</script>
<template>
</template>