<template>
  <div class="mockup-code border border-slate-500 p-5 font-light text-lime-400">
    <pre><slot></slot></pre>
  </div>
</template>
<style lang="postcss" scoped>
.mockup-code {
  font-size: 10px;
  &::before {
    @apply hidden;
  }
}
</style>
