<script setup lang="ts">
import { useCurrentUser, useFirestore, useCollection, useDocument } from "vuefire";

import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useFileDialog } from "@vueuse/core";

import { ref as storageRef, getDownloadURL, deleteObject } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import projects from "~~/server/api/bb/projects";

const toast = useToast();

const dco = useDCO();
const db = useFirestore();
const user = useCurrentUser();
const ui = useUIM();
const api = ref("");

const route = useRoute();
const docRef = doc(db, "dco", route.params.client);
const docSnap = await getDoc(docRef);

const doc_client = doc(collection(db, "dco"), route.params.client);
const contactSource = computed(() => doc_client);
const client_ref = useDocument(contactSource);
const client = ref({
  id: doc_client.id,
  ...client_ref.value,
});

onBeforeMount(() => {
  if (!route.params.client || typeof route.params.client !== "string") {
    throw new Error("Invalid route parameter 'client'");
  }
  if (!route.params.project || typeof route.params.project !== "string") {
    throw new Error("Invalid route parameter 'project'");
  }
  if (!route.params.template || typeof route.params.template !== "string") {
    throw new Error("Invalid route parameter 'template'");
  }
});
const currentProject = client.value.projects.find(
  (project: ProjectC) => project.uid === route.params.project
);
if (!currentProject) {
  throw new Error("Project not found");
}

const fetchProjects = async () => {
  if (client.value.projects.length === 0) {
    return;
  }
  const project: ProjectC = client.value.projects.find(
    (project: ProjectC) => project.uid === route.params.project
  );
  api.value = project.api;
  const projectInfo = await dco.dco_get_project(project.uid, project.api);
  projectInfo.images = project.images;
  if (!projectInfo) {
    throw new Error("Project not found");
  }
  return projectInfo;
};

const project = await fetchProjects();

const template = project.templates.find((template) => template.uid === route.params.template);

if (!template) {
  throw new Error("Template not found");
}

definePageMeta({
  middleware: ["auth"],
});

const { isNotificationsSlideoverOpen, links } = useDashboard();
const breadcrumb = [
  {
    label: links[1]?.label || "Default Label",
    icon: links[1]?.icon || "fa fa-default-icon",
    to: links[1]?.to || "/default-path",
  },
  {
    label: "Proyecto",
    icon: "fa fa-light fa-images",
    to: `/clients/${route.params.client}/${route.params.project}`,
  },
  {
    label: "Template",
    icon: "fa fa-light fa-paintbrush-pencil",
    to: `/clients/${route.params.client}/${route.params.project}/${route.params.template}`,
  },
];
const ok = ref(true);
const uid = ref(route.params.uid);
const colors = ref("#000000");

const model = template?.available_modifications
  ? ref([...template.available_modifications])
  : ref([]);

interface ResponseData {
  images: { image_url: string }[];
}

const resp = ref<ResponseData | null>(null);

model.value.forEach((element) => {
  Object.keys(element).forEach((key) => {
    if (key != "name") {
      if (key == "color") {
        element[key] = { active: false, color: [] };
      }
      if (key == "background") {
        element[key] = { active: false, color: [] };
      }
      if (key == "text") {
        element[key] = [""];
      }
      if (key == "image_url") {
        element[key] = [];
      }
    }
    // console.log(key, element[key]);
  });
});
const resultados = ref<HTMLElement | null>(null);
const onSubmit = async () => {
  console.log("submit");
  ok.value = false;

  resp.value = await $fetch("/api/", {
    method: "POST",
    body: { template: template?.uid, data: model.value, api: api.value },
  });
  // Process images if needed
  resp.value?.images.forEach((image) => {
    // Add any necessary processing here
    image.open = false;
  });
  ok.value = true;
  if (resultados.value) {
    if (resultados.value.scrollIntoView) resultados.value.scrollIntoView({ behavior: "smooth" });
  }
};
const saved = ref(false);
const savedImages = ref<string[]>([]);

const saveImage = async (id: string, indexi: number) => {
  try {
    // Get image element
    const img = document.getElementById(id) as HTMLImageElement;
    if (!img) {
      throw new Error("Image element not found");
    }

    // Set crossOrigin before setting src
    img.crossOrigin = "anonymous";

    // Create a promise to ensure image is loaded
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      const currentSrc = img.src;
      img.src = currentSrc;
    });

    // Create canvas with proper dimensions
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth * 2;
    canvas.height = img.naturalHeight * 2;

    // Get context
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context");
    }

    // Generate file name
    const file_name = `dco/${route.params.client}/${route.params.project}/${route.params.template}-${indexi}.png`;

    // Get storage reference
    const storage = useFirebaseStorage();
    const fileRef = storageRef(storage, file_name);
    const { upload, url } = useStorageFile(fileRef);

    // Draw image to canvas
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 1.0); // Added quality parameter
    });

    if (!blob) {
      throw new Error("Failed to create blob from canvas");
    }

    // Upload and wait for completion
    await upload(blob);

    // Wait for URL to be available
    if (!url.value) {
      throw new Error("Failed to get upload URL");
    }

    // Create a deep copy of projects
    const projectsCopy = JSON.parse(JSON.stringify(client.value.projects));

    // Find and update the current project
    const projectIndex = projectsCopy.findIndex((p: any) => p.uid === route.params.project);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }

    // Ensure images array exists and add new URL
    projectsCopy[projectIndex].images = projectsCopy[projectIndex].images || [];
    projectsCopy[projectIndex].images.push(url.value);

    // Filter out any null/undefined values
    projectsCopy[projectIndex].images = projectsCopy[projectIndex].images.filter(
      (image: string | null | undefined) => image && typeof image === "string"
    );

    // Update Firestore
    await updateDoc(docRef, {
      projects: projectsCopy,
    });

    // Update local state after successful Firestore update
    client.value.projects = projectsCopy;
    savedImages.value = savedImages.value.filter(Boolean); // Remove any null values
    savedImages.value.push(url.value);

    currentProject.images = projectsCopy[projectIndex].images;

    // Success notification
    toast.add({
      id: "image_saved",
      title: "Imagen guardada en proyecto",
      description: `La imagen ha sido guardada en el proyecto.`,
      icon: "i-octicon-desktop-download-24",
      color: "lime",
      timeout: 5000,
    });

    saved.value = true;

    // Optional: Refresh client data to ensure sync
    const refreshedDoc = await getDoc(docRef);
    if (refreshedDoc.exists()) {
      client.value = {
        id: doc_client.id,
        ...refreshedDoc.data(),
      };
    }
  } catch (error) {
    console.error("Save image error:", error);
    toast.add({
      id: "image_error",
      title: "Error al guardar imagen",
      description: error instanceof Error ? error.message : "Error desconocido",
      icon: "i-octicon-desktop-download-24",
      color: "red",
      timeout: 5000,
    });
  }
};
const copyImage = async (imageUrl: string) => {
  try {
    if (!imageUrl) {
      throw new Error("URL de imagen no válida");
    }

    // Get Firebase storage reference and download URL
    const storage = useFirebaseStorage();
    const fileRef = storageRef(storage, imageUrl);

    try {
      const downloadUrl = await getDownloadURL(fileRef);

      // Create and set up new image
      const img = new Image();
      img.crossOrigin = "anonymous";

      // Load image with timeout
      await Promise.race([
        new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (e) => reject(new Error(`Error loading image: ${e}`));
          img.src = downloadUrl;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout loading image")), 15000)
        ),
      ]);

      // Create canvas with proper dimensions
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 1024; // Fallback size if natural size fails
      canvas.height = img.naturalHeight || 1024;

      // Get and check context
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        throw new Error("No se pudo obtener el contexto del canvas");
      }

      // Draw image with error handling
      try {
        context.drawImage(img, 0, 0);
      } catch (drawError) {
        console.error("Draw error:", drawError);
        throw new Error("Error al dibujar la imagen en el canvas");
      }

      // Create blob with quality parameter
      const blob = await new Promise<Blob | null>((resolve) => {
        try {
          canvas.toBlob(resolve, "image/png", 1.0);
        } catch (blobError) {
          console.error("Blob creation error:", blobError);
          resolve(null);
        }
      });

      if (!blob) {
        throw new Error("No se pudo crear el blob de la imagen");
      }

      // Check clipboard API availability
      if (!navigator.clipboard?.write) {
        throw new Error("API del portapapeles no disponible en este navegador");
      }

      // Create and write clipboard item
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);

      // Success notification
      toast.add({
        id: "image_copied",
        title: "Imagen copiada",
        description: "La imagen ha sido copiada al portapapeles",
        icon: "i-octicon-desktop-download-24",
        color: "lime",
        timeout: 3000,
      });
    } catch (innerError) {
      // Try fallback method if primary fails
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);

        toast.add({
          id: "image_copied",
          title: "Imagen copiada",
          description: "La imagen ha sido copiada usando método alternativo",
          icon: "i-octicon-desktop-download-24",
          color: "lime",
          timeout: 3000,
        });
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        throw new Error("No se pudo copiar la imagen usando ningún método");
      }
    }
  } catch (error) {
    console.error("Copy image error:", error);

    toast.add({
      id: "copy_error",
      title: "Error al copiar imagen",
      description:
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error desconocido al copiar la imagen",
      icon: "i-octicon-desktop-download-24",
      color: "red",
      timeout: 5000,
    });
  } finally {
    // Cleanup any remaining references
    try {
      URL.revokeObjectURL(imageUrl);
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }
};
const downloadImage = async (url: string) => {
  try {
    // Get Firebase storage reference
    const storage = useFirebaseStorage();
    const httpsReference = storageRef(storage, url);

    // Get download URL
    const downloadUrl = await getDownloadURL(httpsReference);

    // Fetch the image
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Extract filename from storage path
    const filename = httpsReference.name || `image-${new Date().getTime()}.png`;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    toast.add({
      id: "image_downloaded",
      title: "Imagen descargada",
      description: `Se ha descargado ${filename}`,
      icon: "i-octicon-desktop-download-24",
      color: "lime",
    });
  } catch (error) {
    toast.add({
      id: "download_error",
      title: "Error al descargar",
      description: error instanceof Error ? error.message : "Error desconocido",
      icon: "i-octicon-desktop-download-24",
      color: "red",
    });
  }
};
const removeImage = async (url: string) => {
  try {
    // Validate URL
    if (!url || typeof url !== "string") {
      throw new Error("URL inválida o no encontrada");
    }

    // Validate client and projects data
    if (!client.value?.projects) {
      throw new Error("No se encontró la información del cliente");
    }

    // Create a deep copy of projects
    const projectsCopy = JSON.parse(JSON.stringify(client.value.projects));

    // Find the current project
    const projectIndex = projectsCopy.findIndex((p: any) => p.uid === route.params.project);
    if (projectIndex === -1) {
      throw new Error("No se encontró el proyecto");
    }

    // Filter out the image to be deleted
    projectsCopy[projectIndex].images = (projectsCopy[projectIndex].images || []).filter(
      (image: string) => image !== url
    );

    // First update Firestore
    try {
      await updateDoc(docRef, {
        projects: projectsCopy,
      });

      // Update local state after successful Firestore update
      client.value.projects = projectsCopy;

      // Now remove from storage
      const storage = useFirebaseStorage();
      const fileRef = storageRef(storage, url);

      try {
        await deleteObject(fileRef);
      } catch (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Show warning but don't throw error since Firestore update succeeded
        toast.add({
          id: "storage_warning",
          title: "Advertencia",
          description:
            "La imagen se eliminó de la base de datos pero puede quedar en el almacenamiento",
          icon: "i-octicon-alert",
          color: "yellow",
          timeout: 5000,
        });
      }

      // Success notification
      toast.add({
        id: "image_removed",
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada correctamente",
        icon: "i-octicon-desktop-download-24",
        color: "lime",
        timeout: 5000,
      });
    } catch (firestoreError) {
      console.error("Error updating Firestore:", firestoreError);
      throw new Error("Error al actualizar la base de datos");
    }
  } catch (error) {
    console.error("Remove image error:", error);
    toast.add({
      id: "remove_error",
      title: "Error al eliminar imagen",
      description: error instanceof Error ? error.message : "Error desconocido",
      icon: "i-octicon-desktop-download-24",
      color: "red",
      timeout: 5000,
    });
  }
};
</script>
<template>
  <UDashboardPage v-if="client && project" class="dco-template-page">
    <UDashboardPanel grow>
      <UDashboardNavbar>
        <template #left>
          <UBreadcrumb
            :links="breadcrumb"
            :ui="{
              icon: {
                base: 'flex-shrink-0 self-center text-lg leading-[1em]',
                active: '',
                inactive: '',
              },
            }"
          />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="gray"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="red" inset>
                <UIcon name="i-heroicons-bell" class="h-5 w-5" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <!-- <form @submit.prevent="uploadPicture">
          <fieldset :disabled="!!uploadTask">
            <button type="button" @click="open({ accept: 'image/*', multiple: false })">
              <template v-if="files?.length === 1">
                Selected file: {{ files.item(0)!.name }} (Click to select another)
              </template>
              <template v-else> Select one picture </template>
            </button>

            <br />

            <button>Upload</button>
          </fieldset>
        </form> -->

        <!-- <img v-if="url" :src="url" /> -->

        <UDashboardSection
          :title="`${client.name} - ${project.info.name} - ${template.name}`"
          description="Template activo"
          orientation="vertical"
          class="mt-6 px-4"
          :ui="{
            title: 'text-3xl font-bold',
          }"
          :links="
            currentProject.images
              ? [
                  {
                    label: 'Ver imagenes generadas',
                    color: 'lime',
                    icon: 'i-heroicons-photo',
                    variant: 'outline',
                    click: () => {
                      saved = true;
                    },
                  },
                ]
              : []
          "
        >
          <template #icon>
            <UAvatar :alt="project.info.name" size="xl" class="bg-rose-100 text-rose-800" />
          </template>
        </UDashboardSection>

        <UDivider />
        <template v-if="model.length > 0">
          <UContainer
            :ui="{
              base: 'mx-0 !px-0 flex items-center justify-start gap-8 w-full mt-4 font-mono text-sm',
            }"
          >
            <div v-if="template?.preview_url && template.preview_url.length > 0" class="max-w-md">
              <nuxt-img
                format="webp"
                :src="template?.preview_url"
                :alt="template?.name"
                class="border-base-300 h-40 rounded-lg border border-opacity-40 object-cover"
              />
            </div>
            <ul class="grid grid-cols-2 gap-8">
              <li>
                <h3>Tamaño:</h3>
                <p>{{ template?.width }} x {{ template?.height }}</p>
              </li>
              <li>
                <h3>Modificaciones:</h3>
                <p>{{ template?.available_modifications.length }}</p>
              </li>
              <li>
                <h3>Creado:</h3>
                <p>
                  {{ new Date(Date.parse(template?.created_at)).toLocaleString("es-CO") }}
                </p>
              </li>
              <li>
                <h3>Actualizado:</h3>
                <p>
                  {{ new Date(Date.parse(template?.updated_at)).toLocaleString("es-CO") }}
                </p>
              </li>
            </ul>
          </UContainer>
          <UDivider class="my-4" />
          <UDashboardSection
            title="Modificar"
            :ui="{
              title: 'text-xl font-bold',
            }"
          >
            <form @submit.prevent="onSubmit">
              <UPageGrid
                :ui="{
                  wrapper: 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8',
                }"
              >
                <UCard v-for="(mods, index2) in model" :key="index2" :ui="ui.card_ui">
                  <template #header>
                    <h5 class="fond-semibold mt-2 font-mono text-base capitalize">
                      {{ mods.name }}
                    </h5>
                  </template>
                  <div class="flex w-full flex-col gap-2">
                    <template v-for="(value, name, index3) in mods" :key="name + '-' + index3">
                      <div v-if="name != 'name'" class="block text-right">
                        <Color
                          v-if="name == 'color' || name == 'background'"
                          :name="name"
                          :color="value"
                        />
                        <Text v-if="name == 'text'" :name="name" :text="value" />
                        <File
                          v-if="name == 'image_url'"
                          :name="mods.name"
                          :files="value"
                          :index="index3"
                          :template="template.uid"
                        /></div
                    ></template>
                  </div>
                </UCard>
              </UPageGrid>
            </form>
          </UDashboardSection>
          <UDivider class="my-4" />
          <section>
            <UButton
              :loading="!ok"
              block
              size="lg"
              label="Generar imágenes"
              variant="solid"
              icon="fa fa-sharp fa-solid fa-wand-magic-sparkles"
              @click="onSubmit"
            />
          </section>
          <div v-if="resp">
            <UDivider class="my-4" />
            <UDashboardCard
              v-if="resp.images.length > 0"
              ref="resultados"
              title="Imágenes"
              :description="`Cantidad de imágenes generadas ${resp.images.length}`"
              class="min-h-48"
            >
              <UPageGrid
                v-if="resp && resp.images.length > 0"
                :ui="{
                  wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2',
                }"
              >
                <UPageCard v-for="(image, indexi) in resp.images" :key="indexi">
                  <img :id="'download-' + indexi" :src="image.image_url" alt="" />
                  <template #footer>
                    <div class="flex items-center justify-between gap-2">
                      <UButton
                        icon="i-heroicons-magnifying-glass-plus"
                        size="2xs"
                        color="primary"
                        variant="ghost"
                        square
                        :ui="{ rounded: 'rounded-full' }"
                        @click="image.open = true"
                      />
                      <UButton
                        icon="i-heroicons-check"
                        size="2xs"
                        color="primary"
                        variant="ghost"
                        square
                        :ui="{ rounded: 'rounded-full' }"
                        @click="saveImage('download-' + indexi, indexi)"
                      />
                      <UButton
                        icon="i-heroicons-x-mark"
                        size="2xs"
                        color="primary"
                        variant="ghost"
                        square
                        :ui="{ rounded: 'rounded-full' }"
                        @click="resp.images.splice(indexi, 1)"
                      />
                    </div>
                    <UModal v-model="image.open">
                      <UCard
                        :ui="{
                          base: 'h-full flex flex-col',
                          rounded: '',
                          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                          body: {
                            base: 'grow',
                          },
                        }"
                      >
                        <template #header>
                          <div class="flex items-center justify-between">
                            <h3
                              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                            >
                              Imagen {{ indexi + 1 }}
                            </h3>

                            <UButton
                              color="gray"
                              variant="ghost"
                              icon="i-heroicons-x-mark-20-solid"
                              class="-my-1"
                              @click="image.open = false"
                            />
                          </div>
                        </template>
                        <div class="flex h-full w-full items-center justify-center gap-2">
                          <nuxt-img
                            :id="'download-' + indexi"
                            format="webp"
                            :src="image.image_url"
                            alt=""
                          />
                        </div>
                      </UCard>
                    </UModal>
                  </template> </UPageCard
              ></UPageGrid>
            </UDashboardCard>
            <UDashboardSection
              v-else
              icon="i-heroicons-information-circle"
              title="Imagenes"
              description="No existen imaganes generadas"
              class="!px-4"
            >
            </UDashboardSection>
          </div>
        </template>
        <template v-else>
          <UDashboardSection
            icon="i-heroicons-information-circle"
            description="El template no tiene ninguna configuración activa"
            :ui="{
              icon: {
                wrapper: 'inline-flex',
                base: 'w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white',
              },
            }"
            :links="[
              {
                label: 'Ver en BannerBear',
                icon: 'fa fa-light fa-teddy-bear',
                to: `https://app.bannerbear.com/projects/${route.params.project}/templates/${route.params.template}`,
                target: '_blank',
                color: 'white',
              },
            ]"
          >
          </UDashboardSection>
        </template>
      </UDashboardPanelContent>
      <UDashboardSlideover v-model="saved" title="Guardadas">
        <UPageGrid
          :ui="{ wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-2' }"
        >
          <UCard v-for="(image, index) in currentProject.images" :key="index" :ui="ui.card_ui">
            <nuxt-img :src="image" class="mb-2 w-full" />

            <template #footer>
              <div class="flex items-center justify-between gap-2">
                <UButton
                  icon="i-heroicons-clipboard-document"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  square
                  :ui="{ rounded: 'rounded-full' }"
                  @click="copyImage(image)"
                />
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  square
                  :ui="{ rounded: 'rounded-full' }"
                  @click="downloadImage(image)"
                />
                <UButton
                  icon="i-heroicons-x-mark"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  square
                  :ui="{ rounded: 'rounded-full' }"
                  @click="removeImage(image)"
                />
              </div>
            </template>
          </UCard>
        </UPageGrid>
      </UDashboardSlideover>
    </UDashboardPanel>
  </UDashboardPage>
</template>
