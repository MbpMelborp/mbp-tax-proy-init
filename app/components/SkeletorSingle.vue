<script lang="ts" setup>
const ui = useUIM();
</script>
<template>
  <UCard :ui="ui.card_ui">
    <div class="flex flex-col gap-2">
      <USkeleton class="h-6 w-[250px]" />
      <USkeleton class="h-32 w-full" />
      <USkeleton class="h-6 w-full" />
    </div>
  </UCard>
</template>
