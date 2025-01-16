// composables/useTemplateModel.ts
export const useTemplateModel = (template: Template) => {
  const model = template?.available_modifications
    ? ref([...template.available_modifications])
    : ref([]);

  const initializeModel = () => {
    model.value.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key === "name") return;

        switch (key) {
          case "color":
          case "background":
            element[key] = { active: false, color: [] };
            break;
          case "text":
            element[key] = [""];
            break;
          case "image_url":
            element[key] = [];
            break;
        }
      });
    });
  };

  return {
    model,
    initializeModel,
  };
};
