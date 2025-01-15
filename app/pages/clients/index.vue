<script setup lang="ts">
import { useCurrentUser, useFirestore, useCollection } from "vuefire";
import { collection, addDoc } from "firebase/firestore";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const loaded = ref(false);
const user = useCurrentUser();
const db = useFirestore();
const clientsCol = useCollection(collection(db, "dco"));
const clients = clientsCol.value.map((client) => {
  return {
    id: client.id,
    ...client,
  };
}) as Client[];

loaded.value = true;

const route = useRoute();
const open = ref(false);

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
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: "",
  projects: [],
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data);

  const save = await addDoc(collection(db, "dco"), {
    name: event.data.name,
    projects: [],
  });
  if (save)
    clients.push({
      id: save.id,
      name: event.data.name,
      projects: [],
    });

  open.value = false;
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

      <UDashboardPanelContent v-if="loaded">
        <UDashboardSection
          title="Clientes"
          description="Clientes con proyectos activos"
          orientation="vertical"
          class="mt-6 px-4"
          :ui="{
            title: 'text-3xl font-bold',
          }"
        >
          <template #icon>
            <i class="fa-thin fa-building text-5xl"></i>
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
        <UDashboardModal v-model="open" title="Crear Cliente">
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormGroup label="Nombre" name="nombre">
              <UInput v-model="state.name" />
            </UFormGroup>

            <div class="flex w-full justify-stretch gap-4">
              <UButton color="white" variant="solid" label="Cancel" @click="open = false" />
              <UButton type="submit" class="flex-1"> Guardar </UButton>
            </div>
          </UForm>
        </UDashboardModal>

        <DCOClients v-if="clients.length > 0" :size="`list`" :clients="clients" />

        <UDashboardSection
          v-else
          icon="i-heroicons-information-circle"
          title="Proyectos"
          description="No existen clientes activos"
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
      </UDashboardPanelContent>
      <Skeleton v-else />
    </UDashboardPanel>
  </UDashboardPage>
</template>
