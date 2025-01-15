import VueColor from "@ckpack/vue-color";

// export default ({ app }, inject) => {
//   inject('LocomotiveScroll', LocomotiveScroll)
// }

// export default defineNuxtPlugin((nuxtApp) => {
//   if (process.client) {
//     // gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable)
//   }
//   return {
//     provide: {
//       "compact-picker": Compact,
//     },
//   };
// });

export default defineNuxtPlugin(({ vueApp }) => {
  if (process.client) {
    vueApp.use(VueColor);
  }
});
