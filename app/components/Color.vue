<script setup>
const props = defineProps({
  color: {
    type: [Object],
  },
  name: {
    type: [String],
  },
});
const toggleColor = (color) => {
  if (color.active) {
    color.active = false;
    color.color = [];
  } else {
    color.active = true;
    color.color = [{ hex: "#000000" }];
  }
};
const addColor = (color) => {
  color.color.push({ hex: "#000000" });
};
const popColor = (color, index) => {
  console.log(color, index);
  color.color.splice(index, 1);
  if (color.color.length == 0) {
    toggleColor(color);
  }
};
</script>
<template>
  <UDashboardPanelContent
    :ui="{
      wrapper: '!p-1 flex-1 flex flex-col gap-4 overflow-y-auto border rounded-md',
    }"
    :class="color.active ? 'border-lime-200' : 'border-gray-200 dark:border-gray-700'"
    v-auto-animate
  >
    <div
      class="bg-rounded bg-primary-content flex items-center justify-between space-x-4 rounded-lg bg-opacity-20 px-4 py-2"
    >
      <h4 class="font-mono text-base capitalize">{{ name }}</h4>
      <div class="flex items-center space-x-4">
        <span class="font-mono text-sm">Desactivar</span>
        <UToggle v-model="color.active" @click="toggleColor(color)" />
        <!-- <input type="checkbox" class="toggle" :checked="color.active" @click="toggleColor(color)" /> -->
        <span class="font-mono text-sm">Activar</span>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="color.active">
          <UButton
            color="gray"
            variant="ghost"
            icon="fa fa-regular fa-plus text-xl leading-[1em]"
            class="-my-1"
            @click="addColor(color)"
          />
        </template>
      </div>
    </div>
    <div v-if="color.active" class="mb-2 flex w-full flex-col gap-6 p-2 text-xs">
      <div class="grid gap-4 px-4 pb-4 md:grid-cols-1 lg:grid-cols-2">
        <div v-for="(col, index) in color.color" :key="index">
          <!-- <Pre>{{ col }}</Pre> -->
          <div class="relative">
            <UButton
              size="xs"
              color="gray"
              variant="solid"
              icon="fa fa-regular fa-times text-base leading-[1em]"
              class="absolute -top-4 right-0 z-10 -my-1"
              @click="popColor(color, index)"
            />
            <Sketch v-model="color.color[index]" />
          </div>
        </div>
      </div>
    </div>
  </UDashboardPanelContent>
</template>

<style lang="postcss">
.vc-sketch {
  @apply w-11/12;
}
</style>
