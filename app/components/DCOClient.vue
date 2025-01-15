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
const loading = ref(false);
const error = ref<string | null>(null);
const projects = ref<Project[]>([]);

const fetchProjects = async () => {
  if (!props.client?.projects) {
    console.debug("No client projects found");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    console.debug("Fetching projects for client:", props.client.name);

    if (props.client.projects.length === 0) {
      projects.value = [];
      console.debug("Client has no projects");
      return;
    }

    const projectPromises = props.client.projects.map(async (project) => {
      try {
        console.debug("Fetching project:", project.uid);
        const info: Project = await dco.dco_get_project(project.uid, project.api);
        if (info) {
          return {
            ...info,
            images: project.images || [],
          };
        }
      } catch (err) {
        console.error(`Error fetching project ${project.uid}:`, err);
        error.value = `Error loading project ${project.uid}`;
      }
      return null;
    });

    const results = await Promise.all(projectPromises);
    projects.value = results.filter((project): project is Project => project !== null);
    console.debug("Loaded projects:", projects.value.length);
  } catch (err) {
    console.error("Error fetching projects:", err);
    error.value = "Error loading projects";
  } finally {
    loading.value = false;
    loaded.value = true;
  }
};

// Deep watch for client changes including projects
watch(
  () => props.client,
  (newClient) => {
    console.debug("Client changed, refetching projects");
    if (newClient) {
      fetchProjects();
    }
  },
  { immediate: true, deep: true }
);

// Add mounted hook for initial fetch
onMounted(() => {
  console.debug("Component mounted, initial fetch");
  fetchProjects();
});
</script>

<template>
  <template v-if="loaded" v-auto-animate>
    <UPageCard :ui="ui.page_card" class="dco_client">
      <template #title>
        <h1 class="text-2xl font-semibold leading-6">{{ client.name }}</h1>
      </template>
      <template #icon>
        <UAvatar :alt="client.name" size="xl" class="bg-rose-100 text-rose-800" />
      </template>

      <template #default>
        <div v-if="loading" class="flex justify-center p-4">
          <USpinner />
        </div>

        <div v-else-if="error" class="p-4 text-red-500">
          {{ error }}
        </div>

        <template v-else-if="projects.length > 0">
          <template v-if="size != 'list'">
            <div class="flex flex-col gap-1">
              <p class="text-sm">Listado de proyectos activos</p>
              <UDivider />
              <UPageGrid
                :ui="{
                  wrapper: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2',
                }"
              >
                <template v-for="(project, index) in projects" :key="index">
                  <DCOProject v-if="project" :client="client.id" :project="project" />
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
              <template v-for="(project, index) in projects" :key="index">
                <DCOProject v-if="project" :client="client.id" :project="project" />
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
