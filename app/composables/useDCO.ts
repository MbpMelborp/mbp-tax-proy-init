import { createSharedComposable } from "@vueuse/core";

export const useDCO = () => {
  const dco_client_templates = async function (id: string) {
    const project = await useFetch(`/api/bb/projects/${id}`);
    return project;
  };
  const dco_get_project = async function (uid: string, api_key: string) {
    const { data: responseData } = await useFetch(`/api/bb/project/${uid}`, {
      method: "post",
      body: {
        api_key: api_key,
      },
    });

    return responseData.value;
  };
  return {
    dco_client_templates,
    dco_get_project,
  };
};

// export const useDCO = createSharedComposable(_useDCO);
