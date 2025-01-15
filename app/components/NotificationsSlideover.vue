<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";
import type { Notification } from "~/types";

const { isNotificationsSlideoverOpen } = useDashboard();

const { data: notifications } =
  await useFetch<Notification[]>("/api/notifications");
</script>

<template>
  <UDashboardSlideover
    v-model="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <NuxtLink
      v-for="notification in notifications"
      :key="notification.id"
      :to="`/inbox?id=${notification.id}`"
      class="relative flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <UChip color="red" :show="!!notification.unread" inset>
        <UAvatar
          v-bind="notification.sender.avatar"
          :alt="notification.sender.name"
          size="md"
        />
      </UChip>

      <div class="flex-1 text-sm">
        <p class="flex items-center justify-between">
          <span class="font-medium text-primary-900 dark:text-white">{{
            notification.sender.name
          }}</span>

          <time
            :datetime="notification.date"
            class="text-xs text-primary-500 dark:text-primary-400"
            v-text="formatTimeAgo(new Date(notification.date))"
          />
        </p>
        <p class="text-primary-500 dark:text-primary-400">
          {{ notification.body }}
        </p>
      </div>
    </NuxtLink>
  </UDashboardSlideover>
</template>
