<script setup lang="ts">
import pro from "@nuxt/ui-pro/modules/pro";
import { Client, Project } from "~/types";
const props = defineProps<{
  size?: string;
  client: Client;
}>();

const ui = useUIM();
const dco = useDCO();
const loaded = ref(false);

const projects = ref<Project[]>([]);

const fetchProjects = async () => {
  if (props.client.projects.length === 0) {
    loaded.value = true;
    return;
  }
  for (const project of props.client.projects) {
    const info: Project = await dco.dco_get_project(project.uid, project.api);
    info.images = project.images;
    if (info) {
      projects.value.push(info);
    }
  }
  loaded.value = true;
};
fetchProjects();
</script>
<template>
  <template v-if="loaded" v-auto-animate>
    <UPageCard :ui="ui.page_card" class="dco_client">
      <template #title>
        <h1 class="text-2xl font-semibold leading-6">{{ client.name }}</h1>
      </template>
      <template #icon
        ><UAvatar :alt="client.name" size="xl" class="bg-rose-100 text-rose-800"
      /></template>

      <template #default>
        <template v-if="projects.length > 0">
          <template v-if="size != 'list'">
            <div class="flex flex-col gap-1">
              <p class="text-sm">Listado de proyectos activos</p>
              <UDivider />
              <UPageGrid
                :ui="{
                  wrapper: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2',
                }"
              >
                <template v-for="(project, index) in projects">
                  <DCOProject v-if="project" :key="index" :client="client.id" :project="project" />
                </template>
              </UPageGrid>
            </div>
          </template>
          <template v-else>
            <UCarousel
              v-if="projects.length > 1"
              :items="projects"
              :ui="{
                item: 'basis-full',
                container:
                  'relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth',
              }"
              :prev-button="{
                color: 'gray',
                icon: 'i-heroicons-arrow-left-20-solid',
                class: 'w-8 h-8 -start-4',
              }"
              :next-button="{
                color: 'gray',
                icon: 'i-heroicons-arrow-right-20-solid',
                class: 'w-8 h-8 -end-4',
              }"
              arrows
              class="mx-auto w-full"
            >
              <template #default="{ item, index }">
                <DCOProject :key="index" :client="client.id" :project="item" />
              </template>
            </UCarousel>
            <template v-else>
              <template v-for="(project, index) in projects">
                <DCOProject v-if="project" :key="index" :client="client.id" :project="project" />
              </template>
            </template>
            <UDivider class="mb-4 mt-auto" />
          </template>
        </template>
        <template v-else>
          <UDashboardSection
            icon="i-heroicons-information-circle"
            description="El cliente no tiene proyectos activos"
            :ui="{
              icon: {
                wrapper: 'inline-flex',
                base: 'w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white',
              },
            }"
          >
          </UDashboardSection>
        </template>

        <UButton
          block
          size="lg"
          label="Ver cliente"
          color="gray"
          :ui="{ block: 'justify-between' }"
          :to="`/clients/${client.id}`"
          class="mt-auto"
        >
          <template #trailing>
            <i class="fa-light fa-arrow-right"></i>
          </template>
        </UButton>
      </template>
    </UPageCard>
  </template>
  <SkeletorSingle v-else />
</template>
