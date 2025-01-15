<script lang="ts" setup>
const ui = useUIM();
</script>
<template>
  <UDashboardPanelContent>
    <UProgress animation="carousel" />
    <div class="flex flex-col gap-2 p-4">
      <div class="flex w-full items-center space-x-4">
        <USkeleton class="flex h-14 w-14" :ui="{ rounded: 'rounded-full' }" />
        <div class="flex flex-col gap-2">
          <USkeleton class="mb-2 h-8 w-[250px]" />
          <USkeleton class="h-6 w-[150px]" />
        </div>
      </div>
    </div>
    <UPageGrid
      :ui="{
        wrapper: 'mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-2',
      }"
    >
      <SkeletorSingle v-for="n in 3" :key="n"></SkeletorSingle>
    </UPageGrid>
  </UDashboardPanelContent>
</template>
