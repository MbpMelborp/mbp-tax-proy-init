import { defineEventHandler } from "h3";

const API_KEY = process.env.BB_API_KEY;

async function loadAllProjects() {
  try {
    const response = await fetch("https://api.bannerbear.com/v2/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const projects = await response.json();
    // console.log(projects);
    return projects;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error in loading projects",
      data: { error: (error as Error).message },
    });
  }
}

export default defineEventHandler(async (event) => {
  try {
    const projects = await loadAllProjects();
    return projects;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error in loading projects",
      data: { error: (error as Error).message },
    });
  }
});
