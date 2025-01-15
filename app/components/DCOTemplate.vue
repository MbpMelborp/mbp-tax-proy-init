<script setup lang="ts">
const ui = useUIM();
const open = ref(false);

const props = defineProps<{
  client: Client;
  project: Project;
  template: Template;
}>();
</script>
<template>
  <UCard v-if="client.id" :ui="ui.card_ui" class="dco-template">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="truncate font-mono text-lg font-semibold">{{ template.name }}</h3>
        <UButton
          icon="heroicons-information-circle"
          size="sm"
          color="gray"
          square
          variant="oultine"
          @click="open = true"
        />
      </div>
    </template>
    <div v-if="template.preview_url && template.preview_url.length > 0">
      <nuxt-img
        format="webp"
        :src="template.preview_url"
        :alt="template.name"
        width="300"
        class="border-base-300 rounded-lg border border-opacity-40"
      />
    </div>
    <div class="my-2 flex flex-col gap-2">
      <ul class="flex flex-col space-y-2 font-mono text-xs">
        <li class="flex flex-col gap-1">
          <strong>Tamaño:</strong>
          <span>{{ template.width }} x {{ template.height }}</span>
        </li>
        <li class="flex flex-col gap-1">
          <strong>Creado:</strong>
          <span>
            {{ new Date(Date.parse(template.created_at)).toLocaleString("es-CO") }}
          </span>
        </li>
      </ul>
    </div>

    <template #footer>
      <UButton
        block
        size="xs"
        label="Ver template"
        color="gray"
        :ui="{ block: 'justify-between' }"
        :to="`/clients/${client.id}/${project.info.uid}/${template.uid}`"
      >
        <template #trailing>
          <i class="fa-light fa-arrow-right"></i>
        </template>
      </UButton>
    </template>
  </UCard>

  <UModal v-model="open" :key="template.uid">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Modificaciones: {{ template.available_modifications.length }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="open = false"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-2 font-mono">
        <ul class="text-xs">
          <li v-for="(mods, index2) in template.available_modifications" :key="index2">
            <div
              class="border-b-base-300 flex items-start justify-between border-b border-opacity-40 py-1"
            >
              <h5 class="font-bold capitalize">{{ mods.name }}</h5>
              <div class="mt-0 block">
                <template v-for="(value, name, index3) in mods" :key="index3">
                  <span v-if="name != 'name'" class="mb-1 block text-right">
                    {{ name }}
                  </span></template
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </UCard>
  </UModal>
</template>
