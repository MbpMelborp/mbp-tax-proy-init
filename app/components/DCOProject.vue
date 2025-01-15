<script lang="ts" setup>
const ui = useUIM();
const props = defineProps<{
  size?: string;
  project: Project;
  client?: string;
}>();
</script>
<template>
  <UCard v-if="project" class="dco-project" :ui="ui.card_ui">
    <template #header>
      <h3 class="mb-2 text-lg font-semibold leading-none">{{ project.info.name }}</h3>

      <div
        v-if="project.templates[0] && project.templates[0].preview_url"
        class="aspect-4/3 block w-full rounded-sm object-cover"
      >
        <NuxtImg
          v-if="project.templates[0]"
          class="h-full w-full rounded-sm object-cover"
          :src="project.templates[0].preview_url"
        />
      </div>
    </template>
    <ul class="mb-2 flex flex-col gap-2 font-mono text-sm">
      <li>
        <b>Creado:</b
        ><span>{{ new Date(project.info.created_at).toLocaleDateString("es-ES") }}</span>
      </li>
      <li>
        <b>Templates: </b><span>{{ project.info.templates }}</span>
      </li>
    </ul>

    <template #footer>
      <UButton
        block
        size="xs"
        label="Ver proyecto"
        color="gray"
        :ui="{ block: 'justify-between' }"
        :to="`/clients/${client}/${project.info.uid}`"
      >
        <template #trailing>
          <i class="fa-light fa-arrow-right"></i>
        </template>
      </UButton>
    </template>
  </UCard>
</template>
