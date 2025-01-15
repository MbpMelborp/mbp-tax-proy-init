<script setup lang="ts">
interface Props {
  saved: boolean;
  images?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
});

const emit = defineEmits<{
  "update:saved": [value: boolean];
  "remove-image": [image: string];
}>();

const { copyImage, downloadImage, isLoading } = useImages();
const previewImage = ref<string | null>(null);

const handleRemove = async (image: string) => {
  await useConfirmDialog().reveal({
    message: "¿Estás seguro de eliminar esta imagen?",
    onConfirm: () => emit("remove-image", image),
  });
};
</script>

<template>
  <UDashboardSlideover
    :model-value="saved"
    @update:model-value="emit('update:saved', $event)"
    title="Imagenes guardadas"
  >
    <UPageGrid
      v-if="images?.length"
      :ui="{
        wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-2',
      }"
    >
      <UCard
        v-for="image in images"
        :key="image"
        :ui="{ base: 'overflow-hidden transition-transform hover:scale-[1.02]' }"
      >
        <nuxt-img
          :src="image"
          class="mb-2 w-full cursor-pointer object-cover"
          loading="lazy"
          @click="previewImage = image"
        />

        <template #footer>
          <div class="flex items-center justify-between gap-2">
            <UButton
              icon="i-heroicons-clipboard-document"
              :loading="isLoading(image)"
              size="xs"
              color="gray"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
              @click="copyImage(image)"
            />
            <UButton
              icon="i-heroicons-arrow-down-tray"
              :loading="isLoading(image)"
              size="xs"
              color="gray"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
              @click="downloadImage(image)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="red"
              variant="ghost"
              :ui="{ rounded: 'rounded-full' }"
              @click="handleRemove(image)"
            />
          </div>
        </template>
      </UCard>
    </UPageGrid>
    <UAlert
      v-else
      icon="i-heroicons-photo"
      title="Sin imágenes"
      description="No hay imágenes guardadas en este proyecto"
    />

    <UModal v-model="previewImage" :prevent-close="true" @close="previewImage = null">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Vista previa</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              @click="previewImage = null"
            />
          </div>
        </template>
        <nuxt-img v-if="previewImage" :src="previewImage" class="w-full" loading="lazy" />
      </UCard>
    </UModal>
  </UDashboardSlideover>
</template>
