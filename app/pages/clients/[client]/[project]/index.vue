<script setup lang="ts">
import { useCurrentUser, useFirestore, useCollection, useDocument } from "vuefire";
import { collection, doc } from "firebase/firestore";

import type { Project, Client } from "~/types/";

const dco = useDCO();

const loaded = ref(false);
const db = useFirestore();
const user = useCurrentUser();
const ui = useUIM();

const route = useRoute();
const client = ref({} as Client);
const saved = ref(false);
onBeforeMount(() => {
  if (!route.params.client || typeof route.params.client !== "string") {
    throw new Error("Invalid route parameter 'client'");
  }
  if (!route.params.project || typeof route.params.project !== "string") {
    throw new Error("Invalid route parameter 'project'");
  }
});
const doc_client = doc(collection(db, "dco"), route.params.client);
const contactSource = computed(() => doc_client);
const client_ref = useDocument(contactSource);
const project = ref<Project>();

const fetchProjects = async () => {
  if (client.value.projects.length === 0) {
    return;
  }
  const project = client.value.projects.find((project) => project.uid === route.params.project);
  const projectInfo: Project = await dco.dco_get_project(project.uid, project.api);
  projectInfo.images = project.images;
  loaded.value = true;
  return projectInfo;
};

watch(client_ref, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    client.value = {
      id: doc_client.id,
      ...newVal,
    };
    project.value = await fetchProjects();
  }
});

definePageMeta({
  middleware: ["auth"],
});

const { isNotificationsSlideoverOpen, links } = useDashboard();
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

watch(client_ref, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    client.value = {
      id: doc_client.id,
      ...newVal,
    };
    project.value = await fetchProjects();
  }
});

// Add these functions in the parent component
const handleCopyImage = async (image: string) => {
  // Copy image implementation
};

const handleDownloadImage = async (image: string) => {
  // Download image implementation
};

const handleRemoveImage = async (image: string) => {
  if (!project.value?.images) return;

  try {
    // Implement your image removal logic here
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
</script>

<template>
  <UDashboardPage class="dco-template-page" v-auto-animate>
    <UDashboardPanel grow>
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
      <!-- <Pre>{{ project }}</Pre> -->
      <UDashboardPanelContent v-if="client && project && loaded">
        <UDashboardSection
          :title="`${client.name} - ${project.info.name}`"
          description="Proyecto activo"
          orientation="vertical"
          class="mt-6 px-4"
          :ui="{
            title: 'text-3xl font-bold',
          }"
          :links="
            project.images
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
            <UAvatar :alt="project.info.name" size="xl" class="bg-rose-100 text-rose-800" />
          </template>
        </UDashboardSection>

        <UDivider />

        <UPageGrid
          v-if="project && project.templates"
          :ui="{
            wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2 pt-2',
          }"
        >
          <DCOTemplate
            v-for="(template, index) in project.templates"
            :key="index"
            :template="template"
            :client="client"
            :project="project"
          >
          </DCOTemplate>
        </UPageGrid>
      </UDashboardPanelContent>
      <Skeleton v-else />
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
