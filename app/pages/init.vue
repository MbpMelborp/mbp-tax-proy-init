<script setup lang="ts">
import { useCurrentUser, useFirestore } from "vuefire";
import { collection } from "firebase/firestore";

const user = useCurrentUser();
const db = useFirestore();
const clientsCol = useCollection(collection(db, "dco"));
const loaded = ref(false);

const clients = clientsCol.value.map((client) => {
  return {
    id: client.id,
    ...client,
  };
});

onMounted(() => {
  loaded.value = true;
});

definePageMeta({
  middleware: ["auth"],
});

const { isNotificationsSlideoverOpen, links } = useDashboard();

const breadcrumb = [
  {
    label: links[0]?.label || "",
    icon: links[0]?.icon || "",
    to: links[0]?.to || "",
  },
];
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
          title="DCO"
          description="Clientes con proyectos activos"
          orientation="vertical"
          class="mt-6 px-4"
          :ui="{
            title: 'text-3xl font-bold',
          }"
        >
          <template #icon>
            <i class="fa-solid fa-star text-5xl"></i>
          </template>
        </UDashboardSection>

        <UDivider />

        <DCOClients v-if="clients.length > 0" :clients="clients" />
      </UDashboardPanelContent>
      <Skeleton v-else />
    </UDashboardPanel>
  </UDashboardPage>
</template>
