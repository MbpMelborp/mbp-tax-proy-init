<script setup lang="ts">
import { useFirestore, useCollection } from "vuefire";
import { collection, addDoc } from "firebase/firestore";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Client } from "@/types/Client";

// State
const loaded = ref(false);
const open = ref(false);
const clients = ref<Client[]>([]);

// Composables

const db = useFirestore();
const { isNotificationsSlideoverOpen, links } = useDashboard();

// Firebase Collection
const clientsCol = useCollection(collection(db, "dco"));

// Setup clients data
onMounted(async () => {
  try {
    clients.value = clientsCol.value.map((client) => ({
      id: client.id,
      ...client,
      projects: client.projects || [], // Ensure projects are included and default to an empty array if not present
    })) as Client[];
  } catch (error) {
    console.error("Error loading clients:", error);
  } finally {
    loaded.value = true;
  }
});

// Breadcrumb configuration
const breadcrumb = [
  {
    label: links[1]?.label || "",
    icon: links[1]?.icon || "",
    to: links[1]?.to || "",
  },
];

// Form schema
const schema = z.object({
  name: z.string().min(2, "Muy corto"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: "",
  projects: [],
});

// Form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const save = await addDoc(collection(db, "dco"), {
      name: event.data.name,
      projects: [],
    });

    if (save) {
      clients.value.push({
        id: save.id,
        name: event.data.name,
        projects: [],
      });

      useToast().add({
        title: "Cliente creado exitosamente",
        color: "green",
      });
    }

    open.value = false;
  } catch (error) {
    console.error("Error creating client:", error);
    useToast().add({
      title: "Error al crear el cliente",
      color: "red",
    });
  }
}

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
      <template v-if="loaded">
        <UDashboardPanelContent>
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

          <!-- Create Client Modal -->
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

          <!-- Client List -->
          <template v-if="clients.length > 0">
            <DCOClients :size="'list'" :clients="clients" />
          </template>
          <template v-else>
            <UDashboardSection
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
          </template>
        </UDashboardPanelContent>
      </template>
      <template v-else>
        <Skeleton />
      </template>
    </UDashboardPanel>
  </UDashboardPage>
</template>
