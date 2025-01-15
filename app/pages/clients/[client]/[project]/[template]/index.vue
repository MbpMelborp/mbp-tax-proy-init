<script setup lang="ts">
import { useCurrentUser, useFirestore, useCollection, useDocument } from "vuefire";

import { collection, doc } from "firebase/firestore";

import { useFileDialog } from "@vueuse/core";
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";

const toast = useToast();

const dco = useDCO();
const db = useFirestore();
const user = useCurrentUser();
const ui = useUIM();
const api = ref("");

const route = useRoute();

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

const fetchProjects = async () => {
  if (client.value.projects.length === 0) {
    return;
  }
  const project: ProjectC = client.value.projects.find(
    (project: ProjectC) => project.uid === route.params.project
  );
  api.value = project.api;
  const projectInfo = await dco.dco_get_project(project.uid, project.api);
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
const images = ref<HTMLElement | null>(null);
const onSubmit = async () => {
  console.log("submit");
  ok.value = false;
  resp.value = await $fetch("/api/", {
    method: "POST",
    body: { template: template?.uid, data: model.value, api: api.value },
  });
  ok.value = true;
  if (images.value) {
    images.value.scrollIntoView({ behavior: "smooth" });
  }
  console.log(resp.value);
};
const downloadImage = (id: string, indexi: number) => {
  // const link = document.createElement("a");
  // const canvas = document.createElement("canvas");
  const img = document.getElementById(id) as HTMLImageElement;
  const canvas = document.createElement("canvas");

  const file_name = `dco/${route.params.client}/${route.params.project}/${route.params.template}.png`;
  const storage = useFirebaseStorage();
  const fileRef = storageRef(storage, file_name);

  const {
    url,
    // gives you a percentage between 0 and 1 of the upload progress
    uploadProgress,
    uploadError,
    // firebase upload task
    uploadTask,
    upload,
  } = useStorageFile(fileRef);
  try {
    if (img) {
      img.crossOrigin = "Anonymous";
      const context = canvas.getContext("2d");
      canvas.width = 1024;
      canvas.height = 1024;
      if (context) {
        context.drawImage(img as HTMLImageElement, 0, 0);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          upload(blob)
            ?.then(() => {
              toast.add({
                id: "update_downloaded",
                title: "Imagen guardada en proyecto",
                description: `La imagen ${file_name} ha sido guardada en el proyecto.`,
                icon: "i-octicon-desktop-download-24",
                color: "lime",
              });
            })
            .catch((error) => {
              toast.add({
                id: "update_downloaded",
                title: "Imagen guardada en proyecto",
                description: `La imagen ${file_name} ha sido guardada en el proyecto.`,
                icon: "i-octicon-desktop-download-24",
                color: "red",
              });
            });
          // link.href = URL.createObjectURL(blob);
          // link.download = `image-${route.params.client}-${route.params.project}-${route.params.template}.png`;
          // link.click();
        } else {
          toast.add({
            id: "update_downloaded",
            title: "Update downloaded.",
            description: "It will be installed on restart. Restart now?",
            icon: "i-octicon-desktop-download-24",
            timeout: 0,
            actions: [
              {
                label: "Restart",
                click: () => {},
              },
            ],
          });
        }
      }, "image/png");
    }
  } catch (e) {
    console.error(e);
  }
};

// const {
//   url,
//   // gives you a percentage between 0 and 1 of the upload progress
//   uploadProgress,
//   uploadError,
//   // firebase upload task
//   uploadTask,
//   upload,
// } = useStorageFile(mountainFileRef);
// function uploadPicture() {
//   const data = files.value?.item(0);
//   if (data) {
//     upload(data);
//   }
// }
// const filename = ref<string>();
// const { files, open, reset } = useFileDialog();
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
              color="white"
              variant="solid"
              icon="fa fa-sharp fa-solid fa-wand-magic-sparkles"
              @click="onSubmit"
            />
          </section>
          <div v-if="resp">
            <UDivider ref="images" class="my-4" />
            <UDashboardCard
              title="Imágenes"
              :description="`Cantidad de imágenes generadas ${resp.images.length}`"
            >
              <UPageGrid
                v-if="resp && resp.images.length > 0"
                :ui="{
                  wrapper: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4',
                }"
              >
                <UPageCard v-for="(image, indexi) in resp.images" :key="indexi">
                  <nuxt-img
                    :id="'download-' + indexi"
                    format="webp"
                    :src="image.image_url"
                    alt=""
                  />
                  <template #footer>
                    <UButton
                      block
                      size="xs"
                      label="Descargar"
                      color="primary"
                      variant="outline"
                      :ui="{ block: 'justify-between' }"
                      @click="downloadImage('download-' + indexi, indexi)"
                    >
                      <template #trailing>
                        <i class="fa-light fa-arrow-down"></i>
                      </template>
                    </UButton>
                  </template> </UPageCard
              ></UPageGrid>
            </UDashboardCard>
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
    </UDashboardPanel>
  </UDashboardPage>
</template>
