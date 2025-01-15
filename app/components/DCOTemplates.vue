<script setup lang="ts">
import { Client, Project } from "~/types";
const props = defineProps<{
  client: Client;
  project: Project;
}>();

const ui = useUIM();
const dco = useDCO();

function loadImage(template) {
  console.log("loadImage", template);
  setTimeout(() => {
    template.loaded = true;
  }, 1000);
}
onMounted(() => {
  console.log("mounted");
});
</script>
<template>
  <ULandingGrid :ui="ui.landing_grid" class="dco-templates">
    <UDashboardCard
      title="Proyecto"
      description="proyecto de información"
      icon="i-heroicons-chart-bar"
      :ui="ui.dashboard_card"
    >
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <DCOTemplate
          v-for="(template, index) in project.templates"
          :key="index"
          :template="template"
        >
        </DCOTemplate>
      </div>
      <UDivider class="my-2" />
      <UButton
        block
        label="Ver proyecto"
        color="gray"
        :ui="{ block: 'justify-between' }"
        :to="`/project/1`"
      >
        <template #trailing>
          <i class="fa-light fa-arrow-right"></i>
        </template>
      </UButton>
    </UDashboardCard>
  </ULandingGrid>
</template>
<style lang="postcss"></style>
