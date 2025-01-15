<script setup lang="ts">
const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
  hero: {
    type: Boolean,
    default: false,
  },
});

const uiDash = {
  title: `text-xl dark:text-${props.link.id}-300 text-${props.link.id}-700`,
  header: {
    base: 'h-full ',
    inner: 'gap-8',
  },
  links: 'w-auto ml-auto mt-auto ',
  icon: {
    base: `dark:text-${props.link.id}-500 text-${props.link.id}-500`,
  },
};

const uiHeroIni = {
  title: `text-3xl dark:text-${props.link.id}-300 text-${props.link.id}-700`,
  wrapper: 'space-y-4 *:pt-6 first:*:pt-2 first:*:pt-0 mb-6',
  icon: {
    base: `dark:text-${props.link.id}-500 text-${props.link.id}-500`,
  },
};
const uiHeroTop = {
  title: `text-5xl dark:text-${props.link.id}-300 text-${props.link.id}-700`,
  header: {
    base: 'h-full ',
    inner: 'gap-8',
  },
  description: 'mt-4 text-base',
  links: 'w-auto ml-auto mt-auto ',
  icon: {
    base: `dark:text-${props.link.id}-500 text-${props.link.id}-500`,
  },
};
</script>
<template>
  <UDashboardSection
    :icon="`${props.link.icon} text-5xl mt-2`"
    :title="props.link.label"
    :description="props.link.description"
    orientation="vertical"
    :ui="hero ? uiHeroTop : uiHeroIni"
    :class="``"
  >
    <UPageGrid>
      <UDashboardCard
        v-for="(sublink, index) in props.link.children"
        :key="index"
        v-bind="sublink"
        :title="sublink.label"
        :description="sublink.description"
        :icon="`${sublink.iconp} text-5xl mt-2`"
        :links="[
          {
            color: 'gray',
            trailingIcon: 'fa-light fa-arrow-right-long text-lg',
            to: sublink.to,
          },
        ]"
        :ui="uiDash"
        :class="`rounded-sm shadow-none dark:bg-${props.link.id}-950 bg-${props.link.id}-50 bg-opacity-10 dark:bg-opacity-10`"
      />
    </UPageGrid>
  </UDashboardSection>
</template>
