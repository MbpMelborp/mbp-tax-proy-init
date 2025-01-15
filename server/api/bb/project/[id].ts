import { Bannerbear } from "bannerbear";
import { defineEventHandler } from "h3";

const API_KEY_M = process.env.BB_API_KEY;

async function loadProject(uid: string, API_KEY: string) {
  try {
    const project = await $fetch(`https://api.bannerbear.com/v2/projects/${uid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY_M}`,
      },
    });

    const bannerbear = new Bannerbear(API_KEY);
    const templates = await bannerbear.list_templates();

    const project_info = { info: project, templates: templates };

    return project_info;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Error loading projects",
      data: { error: (error as Error).message },
    });
  }
}

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, "id");

    const { api_key } = await readBody(event);

    if (!uid) {
      throw createError({
        statusCode: 400,
        statusMessage: "UID parameter is missing",
      });
    }

    if (!api_key) {
      throw createError({
        statusCode: 400,
        statusMessage: "API key is missing",
      });
    }

    const projects = await loadProject(uid, api_key);
    return projects;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error in loading projects",
      data: { error: (error as Error).message },
    });
  }
});
