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
</script>

<template>
  <!-- <Pre>
    {{ client }}
  </Pre> -->
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
      <UDashboardPanelContent v-if="client && project && loaded">
        <UDashboardSection
          :title="`${client.name} - ${project.info.name}`"
          description="Proyecto activo"
          orientation="vertical"
          class="mt-6 px-4"
          :ui="{
            title: 'text-3xl font-bold',
          }"
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
    </UDashboardPanel>
  </UDashboardPage>
</template>
