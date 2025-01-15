import { createSharedComposable } from "@vueuse/core";

const _useDashboard = () => {
  const route = useRoute();
  const router = useRouter();
  const links = [
    {
      id: "home",
      label: "Dashboard",
      icon: "fa fa-sharp fa-thin fa-grid-2 w-6 h-6",
      to: "/init",
      tooltip: {
        text: "Dashboard",
        shortcuts: ["H"],
      },
    },
    {
      id: "Clientes",
      label: "Clientes",
      icon: "fa fa-light fa-building w-6 h-6",
      to: "/clients",
      tooltip: {
        text: "Clients",
        shortcuts: ["C"],
      },
    },
    // {
    //   id: 'chat',
    //   label: 'Chat',
    //   icon: 'fa-light fa-sparkles ',
    //   to: '/chat',
    //   description: 'Ai multi-channel chat.',
    //   // badge: '4',
    //   tooltip: {
    //     text: 'Chat',
    //     shortcuts: ['G', 'C']
    //   }
    // },
    // {
    //   id: 'estrategia',
    //   label: 'Estrategia',
    //   description:
    //     'Et esse minim enim amet. Eu consequat commodo in mollit nisi duis ea. Esse esse officia do ullamco pariatur ea excepteur Lorem incididunt nostrud tempor. Fugiat eiusmod reprehenderit in deserunt non aliquip do cupidatat excepteur. Labore commodo consectetur deserunt aliquip incididunt cillum in aliquip ea aliquip aliqua veniam deserunt dolor do. Eiusmod sint ea laborum non laboris non veniam labore elit deserunt. Voluptate quis nisi ullamco culpa. Officia nostrud irure ad ea cupidatat commodo aute veniam ipsum adipisicing aliqua qui aliquip ex.',
    //   to: '/est',
    //   icon: 'fa-thin fa-bullseye-arrow',

    //   children: [
    //     {
    //       label: 'Brief',
    //       to: '/est/brief',
    //       iconp: 'fa-sharp fa-thin fa-star',
    //       description:
    //         'Et esse minim enim amet. Eu consequat commodo in mollit nisi duis ea.',
    //       exact: true,
    //       status: 'Nuevo'
    //     },
    //     {
    //       label: 'Máximas',
    //       iconp: 'fa-thin fa-quote-right',
    //       description:
    //         'Et esse minim enim amet. Eu consequat commodo in mollit nisi duis ea.',
    //       to: '/est/maximas'
    //     },
    //     {
    //       label: 'Herramientas',
    //       iconp: 'fa-sharp fa-thin fa-link',
    //       description:
    //         'Et esse minim enim amet. Eu consequat commodo in mollit nisi duis ea.',
    //       to: '/est/herramientas'
    //     }
    //   ],
    //   tooltip: {
    //     text: 'Estrategia',
    //     shortcuts: ['G', 'E']
    //   }
    // },
    // {
    //   id: 'inbox',
    //   label: 'Inbox',
    //   icon: 'i-heroicons-inbox',
    //   to: '/inbox',
    //   badge: '4',
    //   tooltip: {
    //     text: 'Inbox',
    //     shortcuts: ['G', 'I']
    //   }
    // },
    // {
    //   id: 'users',
    //   label: 'Users',
    //   icon: 'i-heroicons-user-group',
    //   to: '/users',
    //   tooltip: {
    //     text: 'Users',
    //     shortcuts: ['G', 'U']
    //   }
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   to: '/settings',
    //   icon: 'i-heroicons-cog-8-tooth',
    //   children: [
    //     {
    //       label: 'General',
    //       to: '/settings',
    //       exact: true
    //     },
    //     {
    //       label: 'Members',
    //       to: '/settings/members'
    //     },
    //     {
    //       label: 'Notifications',
    //       to: '/settings/notifications'
    //     }
    //   ],
    //   tooltip: {
    //     text: 'Settings',
    //     shortcuts: ['G', 'S']
    //   }
    // }
  ];
  const isHelpSlideoverOpen = ref(false);
  const isNotificationsSlideoverOpen = ref(false);

  defineShortcuts({
    "g-h": () => router.push("/"),
    // "g-i": () => router.push("/inbox"),
    // "g-u": () => router.push("/users"),
    // "g-s": () => router.push("/settings"),
    "?": () => (isHelpSlideoverOpen.value = true),
    n: () => (isNotificationsSlideoverOpen.value = true),
  });

  watch(
    () => route.fullPath,
    () => {
      isHelpSlideoverOpen.value = false;
      isNotificationsSlideoverOpen.value = false;
    }
  );

  return {
    isHelpSlideoverOpen,
    isNotificationsSlideoverOpen,
    links,
  };
};

export const useDashboard = createSharedComposable(_useDashboard);
