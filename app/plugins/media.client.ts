/*import { UploadMedia, UpdateMedia } from "vue-media-upload";

export default defineNuxtPlugin(({ vueApp }) => {
  if (process.client) {
    vueApp.component("upload-media", UploadMedia);
    vueApp.component("update-media", UpdateMedia);
  }
});
*/
import vueFilePond, { setOptions } from "vue-filepond";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const labels_es_ES = {
  labelIdle:
    'Arrastra y suelta tus archivos o <span class = "filepond--label-action"> Examinar <span>',
  labelInvalidField: "El campo contiene archivos inválidos",
  labelFileWaitingForSize: "Esperando tamaño",
  labelFileSizeNotAvailable: "Tamaño no disponible",
  labelFileLoading: "Cargando",
  labelFileLoadError: "Error durante la carga",
  labelFileProcessing: "Cargando",
  labelFileProcessingComplete: "Carga completa",
  labelFileProcessingAborted: "Carga cancelada",
  labelFileProcessingError: "Error durante la carga",
  labelFileProcessingRevertError: "Error durante la reversión",
  labelFileRemoveError: "Error durante la eliminación",
  labelTapToCancel: "toca para cancelar",
  labelTapToRetry: "tocar para volver a intentar",
  labelTapToUndo: "tocar para deshacer",
  labelButtonRemoveItem: "Eliminar",
  labelButtonAbortItemLoad: "Abortar",
  labelButtonRetryItemLoad: "Reintentar",
  labelButtonAbortItemProcessing: "Cancelar",
  labelButtonUndoItemProcessing: "Deshacer",
  labelButtonRetryItemProcessing: "Reintentar",
  labelButtonProcessItem: "Cargar",
  labelMaxFileSizeExceeded: "El archivo es demasiado grande",
  labelMaxFileSize: "El tamaño máximo del archivo es {filesize}",
  labelMaxTotalFileSizeExceeded: "Tamaño total máximo excedido",
  labelMaxTotalFileSize: "El tamaño total máximo del archivo es {filesize}",
  labelFileTypeNotAllowed: "Archivo de tipo no válido",
  fileValidateTypeLabelExpectedTypes: "Espera {allButLastType} o {lastType}",
  imageValidateSizeLabelFormatError: "Tipo de imagen no compatible",
  imageValidateSizeLabelImageSizeTooSmall: "La imagen es demasiado pequeña",
  imageValidateSizeLabelImageSizeTooBig: "La imagen es demasiado grande",
  imageValidateSizeLabelExpectedMinSize: "El tamaño mínimo es {minWidth} × {minHeight}",
  imageValidateSizeLabelExpectedMaxSize: "El tamaño máximo es {maxWidth} × {maxHeight}",
  imageValidateSizeLabelImageResolutionTooLow: "La resolución es demasiado baja",
  imageValidateSizeLabelImageResolutionTooHigh: "La resolución es demasiado alta",
  imageValidateSizeLabelExpectedMinResolution: "La resolución mínima es {minResolution}",
  imageValidateSizeLabelExpectedMaxResolution: "La resolución máxima es {maxResolution}",
};

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);
setOptions(labels_es_ES);
export default defineNuxtPlugin(({ vueApp }) => {
  if (process.client) {
    vueApp.component("file-pond", FilePond);
  }
});
