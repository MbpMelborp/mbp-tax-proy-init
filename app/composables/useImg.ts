export const useImg = () => {
  const loading = ref<Record<string, boolean>>({});
  const error = ref<string | null>(null);

  const isLoading = (url: string): boolean => loading.value[url] || false;

  const copyImage = async (url: string): Promise<boolean> => {
    loading.value[url] = true;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      useToast().add({ title: "Imagen copiada", color: "green" });
      return true;
    } catch (err) {
      error.value = "Failed to copy image";
      useToast().add({ title: "Error al copiar imagen", color: "red" });
      return false;
    } finally {
      loading.value[url] = false;
    }
  };

  const downloadImage = async (url: string): Promise<boolean> => {
    loading.value[url] = true;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop() || "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      useToast().add({ title: "Descarga iniciada", color: "green" });
      return true;
    } catch (err) {
      error.value = "Failed to download image";
      useToast().add({ title: "Error al descargar imagen", color: "red" });
      return false;
    } finally {
      loading.value[url] = false;
    }
  };

  return {
    copyImage,
    downloadImage,
    isLoading,
    error,
  };
};
