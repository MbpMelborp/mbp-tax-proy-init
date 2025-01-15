<script setup lang="ts">
import { useFirebaseAuth, useCurrentUser } from "vuefire";

const auth = useFirebaseAuth();
const user = useCurrentUser();

const { isHelpSlideoverOpen } = useDashboard();
const { isDashboardSearchModalOpen } = useUIState();
const { metaSymbol } = useShortcuts();

const items = computed(() => [
  [
    {
      slot: "account",
      label: "",
      disabled: true,
    },
  ],
  // [
  //   {
  //     label: "Configuración",
  //     icon: "i-heroicons-cog-8-tooth",
  //     to: "/settings",
  //   },
  //   {
  //     label: "Command menu",
  //     icon: "i-heroicons-command-line",
  //     shortcuts: [metaSymbol.value, "K"],
  //     click: () => {
  //       isDashboardSearchModalOpen.value = true;
  //     },
  //   },
  //   {
  //     label: "Help & Support",
  //     icon: "i-heroicons-question-mark-circle",
  //     shortcuts: ["?"],
  //     click: () => (isHelpSlideoverOpen.value = true),
  //   },
  // ],
  // [
  //   {
  //     label: "Documentation",
  //     icon: "i-heroicons-book-open",
  //     to: "https://ui.nuxt.com/pro/getting-started",
  //     target: "_blank",
  //   },
  // ],
  [
    {
      label: "Salir",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => auth.signOut().then(() => navigateTo("/")),
    },
  ],
]);
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        truncate
        :label="user.displayName"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template v-if="user.photoURL" #leading>
          <UAvatar :src="user.photoURL" size="2xs" />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="ml-auto h-5 w-5" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p class="text-primary-900 dark:text-primary-50 truncate font-medium">
          {{ user.email.split("@")[0] }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
