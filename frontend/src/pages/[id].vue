<script setup lang="ts">
const route = useRoute();
route.params.id

await navigateTo('', {
  external: true
})
</script>