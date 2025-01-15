<script setup lang="ts">
import { useFirestore, useDocument } from "vuefire";
import { doc, updateDoc } from "firebase/firestore";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Client, Project } from "~/types/";

// Composables
const dco = useDCO();
const db = useFirestore();
const route = useRoute();
const { isNotificationsSlideoverOpen, links } = useDashboard();

// State
const open = ref(false);
const loaded = ref(false);
const client = ref<Client>({} as Client);
const projects = ref<Project[]>([]);

// Route validation
onBeforeMount(() => {
  if (!route.params.id || typeof route.params.id !== "string") {
    throw createError({
      statusCode: 400,
      message: "Invalid route parameter 'id'",
    });
  }
});

// Firebase setup
const doc_client = doc(db, "dco", route.params.id);
const contactSource = computed(() => doc_client);
const client_ref = useDocument(contactSource);

// Projects fetching
const fetchProjects = async () => {
  try {
    if (!client.value?.projects?.length) {
      projects.value = [];
      return;
    }

    const projectPromises = client.value.projects.map(async (project) => {
      try {
        const info: Project = await dco.dco_get_project(project.uid, project.api);
        return {
          ...info,
          images: project.images || [],
        };
      } catch (error) {
        console.error(`Error fetching project ${project.uid}:`, error);
        return null;
      }
    });

    const results = await Promise.all(projectPromises);
    projects.value = results.filter((project): project is Project => project !== null);
  } catch (error) {
    console.error("Error fetching projects:", error);
    useToast().add({
      title: "Error al cargar los proyectos",
      color: "red",
    });
  } finally {
    loaded.value = true;
  }
};

// Watchers
watch(client_ref, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    client.value = {
      id: doc_client.id,
      ...newVal,
    };
    await fetchProjects();
  }
});

// Form schema
const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  uid: z.string().min(2, "UID muy corto"),
  api: z.string().min(2, "API key muy corta"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  api: "",
  name: "",
  uid: "",
});

// Form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await updateDoc(doc(db, "dco", route.params.id), {
      projects: [
        ...client.value.projects,
        {
          uid: event.data.uid,
          api: event.data.api,
          name: event.data.name,
        },
      ],
    });

    await fetchProjects();
    open.value = false;

    useToast().add({
      title: "Proyecto creado exitosamente",
      color: "green",
    });

    // Reset form
    state.api = "";
    state.name = "";
    state.uid = "";
  } catch (error) {
    console.error("Error creating project:", error);
    useToast().add({
      title: "Error al crear el proyecto",
      color: "red",
    });
  }
}
// Breadcrumb configuration
const breadcrumb = computed(() => [
  {
    label: links[1]?.label || "",
    icon: links[1]?.icon || "",
    to: links[1]?.to || "",
  },
]);

// Page meta
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <UDashboardPage v-auto-animate>
    <UDashboardPanel grow>
      <!-- Navbar -->
      <UDashboardNavbar>
        <template #left>
          <UBreadcrumb
            :links="breadcrumb"
            :ui="{
              icon: {
                base: 'flex-shrink-0 self-center text-lg leading-[1em]',
                active: '',
                inactive: '',
              },
            }"
          />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="gray"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="red" inset>
                <UIcon name="i-heroicons-bell" class="h-5 w-5" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <!-- Main Content -->
      <UDashboardPanelContent>
        <template v-if="loaded && client">
          <!-- Client Section -->
          <UDashboardSection
            :title="client.name"
            description="Proyectos activos"
            orientation="vertical"
            class="mt-6 px-4"
            :ui="{ title: 'text-3xl font-bold' }"
          >
            <template #icon>
              <UAvatar :alt="client.name" size="xl" class="bg-rose-100 text-rose-800" />
            </template>
            <template #links>
              <UButton
                icon="i-heroicons-plus-circle"
                color="white"
                square
                variant="ghost"
                :ui="{ rounded: 'rounded-full' }"
                @click="open = true"
              />
            </template>
          </UDashboardSection>

          <UDivider />

          <!-- Projects Grid -->
          <template v-if="projects.length > 0">
            <UPageGrid
              :ui="{
                wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 pt-2',
              }"
            >
              <DCOProject
                v-for="project in projects"
                :key="project.uid"
                :client="route.params.id.toString()"
                :project="project"
              />
            </UPageGrid>
          </template>

          <!-- Empty State -->
          <template v-else>
            <UDashboardSection
              icon="i-heroicons-information-circle"
              title="Proyectos"
              description="No existen proyectos activos"
              class="!px-4"
            >
              <template #links>
                <UButton
                  icon="i-heroicons-plus-circle"
                  color="white"
                  square
                  variant="ghost"
                  :ui="{ rounded: 'rounded-full' }"
                  @click="open = true"
                />
              </template>
            </UDashboardSection>
          </template>
        </template>

        <!-- Loading State -->
        <Skeleton v-else />

        <!-- Create Project Modal -->
        <UDashboardModal v-model="open" title="Crear proyecto">
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormGroup label="Nombre" name="nombre">
              <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup label="Uid" name="uid">
              <UInput v-model="state.uid" />
            </UFormGroup>
            <UFormGroup label="Api key" name="api">
              <UInput v-model="state.api" />
            </UFormGroup>

            <div class="flex w-full justify-stretch gap-4">
              <UButton color="white" variant="solid" label="Cancel" @click="open = false" />
              <UButton type="submit" class="flex-1"> Guardar </UButton>
            </div>
          </UForm>
        </UDashboardModal>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
