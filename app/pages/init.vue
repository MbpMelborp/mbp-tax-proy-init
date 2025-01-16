<script setup lang="ts">
import { useCurrentUser } from "vuefire";

// Composables
const { getClients } = useFirestoreDb();
const { clients, loaded, error } = getClients();
const { isNotificationsSlideoverOpen, links } = useDashboard();

// Breadcrumb configuration
const breadcrumb = computed(() => [
  {
    label: links[0]?.label || "",
    icon: links[0]?.icon || "",
    to: links[0]?.to || "",
  },
]);

// Set loaded state
onMounted(() => {
  loaded.value = true;
});

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

      <!-- Content -->
      <UDashboardPanelContent v-if="loaded">
        <!-- Error Alert -->
        <UAlert v-if="error" :title="error.message" color="red" class="mb-4" />

        <!-- Main Content -->
        <template v-else>
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
              <i class="fa-light fa-circle-stack text-5xl"></i>
            </template>
          </UDashboardSection>

          <UDivider />

          <!-- Clients List -->
          <template v-if="clients.length > 0">
            <DCOClients :size="'list'" :clients="clients" />
          </template>
          <template v-else>
            <UAlert
              title="No hay clientes activos"
              description="No se encontraron clientes en el sistema"
              color="yellow"
              class="mx-4"
            />
          </template>
        </template>
      </UDashboardPanelContent>

      <!-- Loading State -->
      <Skeleton v-else />
    </UDashboardPanel>
  </UDashboardPage>
</template>
