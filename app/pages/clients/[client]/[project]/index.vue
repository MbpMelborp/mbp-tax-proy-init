<script setup lang="ts">
import { useCurrentUser, useFirestore, useCollection, useDocument } from "vuefire";
import { Firestore, collection, doc } from "firebase/firestore";
import type { Client } from "@/types/Client";
import type { Project } from "@/types/Project";

// Composables
const dco = useDCO();
const ui = useUIM();
const route = useRoute();
const { isNotificationsSlideoverOpen, links } = useDashboard();

// State
const loaded = ref(false);
const client = ref({} as Client);
const project = ref<Project>();
const saved = ref(false);

// Firebase
const db = useFirestore();
const user = useCurrentUser();
const doc_client = doc(collection(db as Firestore, "dco"), route.params.client);
const contactSource = computed(() => doc_client);
const client_ref = useDocument(contactSource);

// Route validation
onBeforeMount(() => {
  if (!route.params.client || typeof route.params.client !== "string") {
    throw new Error("Invalid route parameter 'client'");
  }
  if (!route.params.project || typeof route.params.project !== "string") {
    throw new Error("Invalid route parameter 'project'");
  }
});

// Breadcrumb configuration
const breadcrumb = [
  {
    label: links[1]?.label || "",
    icon: links[1]?.icon || "",
    to: links[1]?.to || "",
  },
  {
    label: "Proyecto",
    icon: "fa fa-light fa-images",
    to: "/clients/" + route.params.client + "/" + route.params.project,
  },
];

// Data fetching
const fetchProjects = async () => {
  if (!client.value?.projects) {
    loaded.value = true;
    return null;
  }

  const projectData = client.value.projects.find((p) => p.uid === route.params.project);

  if (!projectData) {
    loaded.value = true;
    return null;
  }

  try {
    const projectInfo: Project = await dco.dco_get_project(projectData.uid, projectData.api);
    projectInfo.images = projectData.images || [];
    return projectInfo;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
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

    await nextTick();
    project.value = await fetchProjects();
  }
});

// Event handlers
const handleCopyImage = async (image: string) => {
  // Implement copy functionality
  try {
    await navigator.clipboard.writeText(image);
    useToast().add({
      title: "URL copiada al portapapeles",
      color: "green",
    });
  } catch (error) {
    useToast().add({
      title: "Error al copiar la URL",
      color: "red",
    });
  }
};

const handleDownloadImage = async (image: string) => {
  // Implement download functionality
  try {
    const response = await fetch(image);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    useToast().add({
      title: "Error al descargar la imagen",
      color: "red",
    });
  }
};

const handleRemoveImage = async (image: string) => {
  if (!project.value?.images) return;

  try {
    project.value.images = project.value.images.filter((img) => img !== image);
    useToast().add({
      title: "Imagen eliminada",
      color: "green",
    });
  } catch (error) {
    useToast().add({
      title: "Error al eliminar la imagen",
      color: "red",
    });
  }
};

// Page meta
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <UDashboardPage class="dco-template-page" v-auto-animate>
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
          <!--   <UTooltip text="Notifications" :shortcuts="['N']">
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
          </UTooltip> -->
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>

      <!-- Main Content -->
      <UDashboardPanelContent v-if="loaded">
        <template v-if="client && project">
          <UDashboardSection
            :title="`${client.name} - ${project.info.name}`"
            description="Proyecto activo"
            orientation="vertical"
            class="mt-6 px-4"
            :ui="{
              title: 'text-3xl font-bold',
            }"
            :links="
              project.images?.length > 0
                ? [
                    {
                      label: 'Ver imagenes generadas',
                      color: 'lime',
                      icon: 'i-heroicons-photo',
                      variant: 'outline',
                      click: () => {
                        saved = true;
                      },
                    },
                  ]
                : []
            "
          >
            <template #icon>
              <UAvatar :alt="project.info.name" size="xl" class="bg-primary-400 text-white" />
            </template>
          </UDashboardSection>

          <UDivider />

          <!-- Templates Grid -->
          <UPageGrid
            v-if="project.templates"
            :ui="{
              wrapper:
                'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 pt-2',
            }"
          >
            <DCOTemplate
              v-for="(template, index) in project.templates"
              :key="template.id || index"
              :template="template"
              :client="client"
              :project="project"
            />
          </UPageGrid>
        </template>
        <Skeleton v-else />
      </UDashboardPanelContent>

      <!-- Side Panel -->
      <DCOSide
        v-if="project"
        v-model:saved="saved"
        :images="project.images"
        @copy-image="handleCopyImage"
        @download-image="handleDownloadImage"
        @remove-image="handleRemoveImage"
      />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
.dco-template-page {
  min-height: 100vh;
}
</style>
