<template>
  <UDashboardPanelContent
    :ui="{
      wrapper:
        '!p-1 flex-1 flex flex-col gap-4 overflow-y-auto border rounded-md border-gray-200 dark:border-gray-700',
    }"
    v-auto-animate
  >
    <div class="flex items-center justify-between space-x-4 px-4 py-2">
      <h4 class="text-base capitalize">{{ name }}</h4>
      <UButton
        color="gray"
        variant="ghost"
        icon="fa fa-regular fa-plus text-xl leading-[1em]"
        class="-my-1"
        @click="addText(text)"
      />
    </div>
    <UDivider class="my-1" />
    <div class="mb-2 flex w-full flex-col gap-6 p-1">
      <div class="grid grid-cols-1 gap-2">
        <div v-for="(col, index) in text" :key="index">
          <!-- <Pre>{{ col }}</Pre> -->
          <div class="relative">
            <UButton
              v-if="index > 0"
              color="red"
              variant="ghost"
              icon="fa fa-sharp fa-solid fa-xmark text-xl leading-[1em]"
              class="absolute right-0 z-10"
              @click="addText(text)"
            />
            <UFormGroup
              :ui="{
                container: 'mt-0 relative',
              }"
            >
              <UTextarea
                v-model="text[index]"
                :padded="false"
                variant="none"
                :rows="2"
                :autoresize="true"
                :placeholder="`Texto ${index + 1}`"
                size="sm"
                :ui="{
                  size: {
                    sm: 'text-xs font-mono',
                  },
                }"
              />
              <UDivider v-if="text.length > 1" class="my-1" />
            </UFormGroup>
          </div>
        </div>
      </div>
    </div>
  </UDashboardPanelContent>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [Array],
  },
  name: {
    type: [String],
  },
});
const addText = (text) => {
  text.push("");
};
const popText = (text, index) => {
  text.splice(index, 1);
};
</script>

<style></style>
