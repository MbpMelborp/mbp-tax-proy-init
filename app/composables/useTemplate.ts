// composables/useTemplate.ts
export const useTemplate = () => {
  const route = useRoute();
  const { getClientDoc } = useFirestoreDb();
  const dco = useDCO();

  const fetchTemplate = async (client: Client) => {
    if (!client.projects.length) return null;

    const project = client.projects.find((p: ProjectC) => p.uid === route.params.project);
    if (!project) throw new Error("Project not found");

    const projectInfo = await dco.dco_get_project(project.uid, project.api);
    projectInfo.images = project.images || [];

    const template = projectInfo.templates.find((t) => t.uid === route.params.template);
    if (!template) throw new Error("Template not found");

    return {
      project: projectInfo,
      template,
      api: project.api,
    };
  };

  return {
    fetchTemplate,
  };
};
