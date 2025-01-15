<script setup lang="ts">
import { useFirestore, useDocument } from "vuefire";
import { doc, updateDoc } from "firebase/firestore";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Client, Project } from "~/types/";

const dco = useDCO();
const db = useFirestore();
const route = useRoute();
const open = ref(false);
const loaded = ref(false);

const client = ref({} as Client);

onBeforeMount(() => {
  if (!route.params.id || typeof route.params.id !== "string") {
    throw new Error("Invalid route parameter 'id'");
  }
});
const doc_client = doc(db, "dco", route.params.id);
const contactSource = computed(() => doc_client);
const client_ref = useDocument(contactSource);

const projects = ref<Project[]>([]);
const fetchProjects = async () => {
  console.log("Fetching projects");
  if (client.value.projects.length === 0) {
    loaded.value = true;
    return;
  }
  projects.value = [];
  for (const project of client.value.projects) {
    const info: Project = await dco.dco_get_project(project.uid, project.api);
    if (info !== null || info !== undefined) {
      projects.value.push(info);
    }
  }
  loaded.value = true;
};

watch(client_ref, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    client.value = {
      id: doc_client.id,
      ...newVal,
    };
    if (client.value.projects.length > 0) fetchProjects();
    else loaded.value = true;
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
];

const schema = z.object({
  name: z.string().min(2, "Muy corto"),
  uid: z.string().min(2, "Muy corto"),
  api: z.string().min(2, "Muy corto"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  api: "",
  name: "",
  uid: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data);

  updateDoc(doc(db, "dco", route.params.id), {
    projects: [
      ...client.value.projects,
      {
        uid: event.data.uid,
        api: event.data.api,
        name: event.data.name,
      },
    ],
  }).then((res) => {
    fetchProjects();
    open.value = false;
  });
}
</script>

<template>
  <UDashboardPage v-auto-animate>
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
      <UDashboardPanelContent>
        <template v-if="loaded">
          <UDashboardSection
            v-if="client"
            :title="client.name"
            description="Proyectos activos"
            orientation="vertical"
            class="mt-6 px-4"
            :ui="{
              title: 'text-3xl font-bold',
            }"
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
            /></template>
          </UDashboardSection>
          <UDivider />
          <template v-if="projects">
            <UPageGrid
              v-if="projects && projects.length > 0"
              :ui="{
                wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 pt-2',
              }"
            >
              <template v-for="(project, index) in projects">
                <DCOProject
                  v-if="project"
                  :key="index"
                  :client="Array.isArray(route.params.id) ? route.params.id[0] : route.params.id"
                  :project="project"
                />
              </template>
            </UPageGrid>

            <UDashboardSection
              v-else
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
        <Skeleton v-else />

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
