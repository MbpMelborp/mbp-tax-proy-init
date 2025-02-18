export const useUIM = () => {
  const colors =
    "dark:from-gray-400/10 from-gray-400/10 from-20% dark:via-primary-950/10 via-primary-50/10 via-50% to-gray-200/10 dark:to-gray-800/10 to-90% ";
  const gradient_1 = "bg-gradient-to-tl " + colors;
  const gradient_2 = "bg-gradient-to-br " + colors;
  const page_card = {
    wrapper: "relative group " + gradient_2,
    to: "hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
    icon: {
      wrapper: "mb-2 flex",
      base: "w-10 h-10 flex-shrink-0 text-primary",
    },
    body: {
      base: "flex-1 h-full flex flex-col gap-4",
    },
    title: "text-xl font-semibold truncate flex items-center gap-1.5 min-h-10",
    description: "text-xs text-gray-500 dark:text-gray-400 mt-1",
  };

  const card_ui = {
    base: "h-full flex flex-col",
    background: gradient_1,
    divide: "divide-y divide-gray-200 dark:divide-gray-800",
    ring: "ring-1 ring-gray-200 dark:ring-gray-800",
    rounded: "rounded-lg",
    shadow: "",
    body: {
      base: "",
      background: "",
      padding: "px-4 py-4 sm:p-2",
    },
    header: {
      base: "",
      background: "",
      padding: "px-4 py-4 sm:px-2",
    },
    footer: {
      base: "mt-auto",
      background: "",
      padding: "px-4 py-4 sm:px-2",
    },
  };

  const landing_grid = {
    wrapper: "flex flex-col lg:grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 relative",
  };
  const dashboard_card = {
    divide: "" + gradient_2,
    header: {
      base: "flex flex-wrap items-center justify-between gap-2",
      inner: "flex items-start gap-4",
      padding: "px-4 py-4 sm:px-4",
    },
    title: "text-gray-900 dark:text-white font-semibold",
    description: "mt-1 text-gray-500 dark:text-gray-400 text-sm",
    links: "flex flex-wrap items-center gap-1.5",
    icon: {
      wrapper: "inline-flex",
      base: "w-12 h-12 flex-shrink-0 text-gray-900 dark:text-white",
    },
  };
  return {
    page_card,
    card_ui,
    landing_grid,
    dashboard_card,
  };
};
