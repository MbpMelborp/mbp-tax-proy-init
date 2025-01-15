<script setup lang="ts">
const route = useRoute();
// const appConfig = useAppConfig();
const { isHelpSlideoverOpen, links } = useDashboard();

const footerLinks = [
  {
    label: "Invite people",
    icon: "i-heroicons-plus",
    to: "/settings/members",
  },
  {
    label: "Help & Support",
    icon: "i-heroicons-question-mark-circle",
    click: () => (isHelpSlideoverOpen.value = true),
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
  {
    key: "code",
    label: "Code",
    commands: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${
              route.path === "/" ? "/index" : route.path
            }.vue`,
            "_blank"
          );
        },
      },
    ],
  },
];
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="200" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <svgo-mbp class="text-primary mb-auto block h-16 w-16" />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton label="Buscar..." />
        </template>

        <UDivider />

        <UDashboardSidebarLinks
          :links="links"
          :ui="{ icon: { base: 'text-lg flex-shrink-0 w-5 h-5 relative' } }"
        />

        <UDivider />

        <!-- <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="(colors) => (defaultColors = colors)"
        /> -->

        <div class="flex-1" />

        <!-- <UDashboardSidebarLinks :links="footerLinks" /> -->

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <!-- <HelpSlideover /> -->
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <!-- <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly> -->
  </UDashboardLayout>
</template>
