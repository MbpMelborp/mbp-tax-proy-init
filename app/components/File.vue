<script setup>
const props = defineProps({
  files: {
    type: [Array],
  },
  template: {
    type: [String],
  },
  name: {
    type: [String],
  },
  index: {
    type: [Number],
  },
});
// const server =
//   process.env.NODE_ENV != "development"
//     ? "http://localhost"
//     : "http://creator.melborp.co";

const server = "https://creator.melborp.co";
const myFiles = ref([]);
const getUrl = (uploads, files) => {
  console.log("props", props.name, files);
  const fileArray = uploads.map((file) => file.name);
  files = fileArray;
  console.log("GET URL", fileArray);
};
const handleFilePondInit = () => {
  console.log("FilePond has initialised");
};
const updateFiles = (uploads, files) => {
  //   files = uploads.map((file) => file.serverId);
  //   console.log("files", files, uploads[0].serverId);
  //   this.$root.$emit("updatePendingFiles", this.myFiles);
};
const processFile = (error, file) => {
  console.log("FilePond succesfully processed file ", file.serverId);
  props.files.push(file.serverId);
};
2;
const removeFile = (error, file) => {
  console.log("FilePond succesfully remove file ", file.serverId);
  //   props.files.push(file.serverId);
  const index = props.files.indexOf(file.serverId);
  if (index > -1) {
    props.files.splice(index, 1);
  }
};
</script>

<template>
  <UDashboardPanelContent
    v-auto-animate
    :ui="{
      wrapper:
        '!p-1 flex-1 flex flex-col gap-4 overflow-y-auto border rounded-md border-gray-200 dark:border-gray-700',
    }"
  >
    <div class="mb-2 flex w-full flex-col space-y-6 rounded-md p-1 text-xs">
      <div class="grid grid-cols-1 gap-4">
        <div class="media-up relative">
          <client-only>
            <file-pond
              name="image"
              :ref="name + '_' + 'pond'"
              label-idle="Sube las imágenes aquí"
              v-bind:allow-multiple="true"
              accepted-file-types="image/jpeg, image/png"
              :server="server + '/api/upload?up=1&template=' + template + '&name=' + name"
              v-bind:files="myFiles"
              v-on:init="handleFilePondInit"
              v-on:updatefiles="updateFiles"
              v-on:processfile="processFile"
              v-on:removefile="removeFile"
            />
          </client-only>
        </div>
      </div>
    </div>
  </UDashboardPanelContent>
</template>

<style lang="postcss">
.filepond--root {
  @apply font-mono;
}
.filepond--root .filepond--credits {
  @apply hidden;
}
/* use a hand cursor intead of arrow for the action buttons */
.filepond--file-action-button {
  cursor: pointer;
}

/* the text color of the drop label*/
.filepond--drop-label {
  @apply text-primary;
}

/* underline color for "Browse" button */
.filepond--label-action {
  /* text-decoration-color: #aaa; */
}

/* the background color of the filepond drop area */
.filepond--panel-root {
  /* background-color: #eee; */
}

/* the border radius of the drop area */
.filepond--panel-root {
  border-radius: 0.5em;
}

/* the border radius of the file item */
.filepond--item-panel {
  border-radius: 0.5em;
}

/* the background color of the file and file panel (used when dropping an image) */
.filepond--item-panel {
  /* @apply bg-primary-content bg-opacity-20; */
}

/* the background color of the drop circle */
.filepond--drip-blob {
  /* @apply bg-primary-content bg-opacity-20; */
}

/* the background color of the black action buttons */
.filepond--file-action-button {
  @apply bg-primary-200 dark:bg-primary-800 bg-opacity-20 dark:bg-opacity-20;
}

/* the icon color of the black action buttons */
.filepond--file-action-button {
  /* color: white; */
}

/* the color of the focus ring */
.filepond--file-action-button:hover,
.filepond--file-action-button:focus {
  /* box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.9); */
}

/* the text color of the file status and info labels */
.filepond--file {
  /* color: white; */
}

/* error state color */
[data-filepond-item-state*="error"] .filepond--item-panel,
[data-filepond-item-state*="invalid"] .filepond--item-panel {
  background-color: red;
}

[data-filepond-item-state="processing-complete"] .filepond--item-panel {
  /* background-color: green; */
  @apply bg-lime-300;
}
.filepond--image-preview-overlay-success {
  @apply text-lime-600;
}
/* bordered drop area */
.filepond--panel-root {
  @apply bg-gray-200 dark:bg-gray-600;
}
.filepond--drop-label {
  &::after {
    content: "\f0ee";
    font-family: "Font Awesome 6 Pro";
    @apply text-primary flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-gray-600;
  }
}
.media-up {
  .gallery {
    @apply !border-gray-400 !bg-gray-800 !text-gray-400 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400;
    .images-upload {
      @apply !bg-black;
      svg {
        @apply ml-2 !h-8 !w-8 !text-gray-400 dark:text-gray-400;
      }
    }
  }
}
</style>
