<template>
  <div class="flex h-dvh w-screen flex-col items-stretch md:flex-row">
    <div class="flex h-full w-full flex-col px-8 py-4 md:w-1/2">
      <svgo-mbp class="text-primary mb-auto block h-24 w-24" />
      <client-only>
        <UColorModeButton
          :ui="{
            base: 'w-8',
          }"
        />
      </client-only>
    </div>
    <div class="bg-primary-100 dark:bg-primary-900 flex h-full w-full items-center justify-center md:w-1/2">
      <slot />
    </div>
  </div>
</template>
