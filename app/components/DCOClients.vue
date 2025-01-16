<script setup lang="ts">
const props = defineProps<{
  size?: string;
  clients: Client[];
}>();
</script>
<template>
  <UPageGrid
    :ui="{
      wrapper: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 pt-2',
    }"
    class="dco-clients"
  >
    <DCOClient v-for="(client, index) in clients" :key="index" :client="client" :size="size" />
  </UPageGrid>
</template>
