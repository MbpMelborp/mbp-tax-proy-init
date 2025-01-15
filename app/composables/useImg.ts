export const useImg = () => {
  const loadingStates = ref<Map<string, boolean>>(new Map());
  const error = ref<string | null>(null);

  const isLoading = (imageUrl: string): boolean => {
    return loadingStates.value.get(imageUrl) || false;
  };

  const setLoading = (imageUrl: string, loading: boolean) => {
    loadingStates.value.set(imageUrl, loading);
  };

  const copyImage = async (imageUrl: string): Promise<boolean> => {
    try {
      setLoading(imageUrl, true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      return true;
    } catch (err) {
      error.value = "Failed to copy image";
      return false;
    } finally {
      setLoading(imageUrl, false);
    }
  };

  const downloadImage = async (imageUrl: string): Promise<boolean> => {
    try {
      setLoading(imageUrl, true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = imageUrl.split("/").pop() || "image";
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      error.value = "Failed to download image";
      return false;
    } finally {
      setLoading(imageUrl, false);
    }
  };

  return {
    copyImage,
    downloadImage,
    isLoading,
    error,
  };
};
