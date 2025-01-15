export const useImages = () => {
  const loading = ref<Record<string, boolean>>({});
  
  const copyImage = async (url: string) => {
    loading.value[url] = true;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      useToast().add({ title: 'Imagen copiada', color: 'green' });
    } catch (error) {
      useToast().add({ title: 'Error al copiar imagen', color: 'red' });
    } finally {
      loading.value[url] = false;
    }
  };

  const downloadImage = async (url: string) => {
    loading.value[url] = true;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop() || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      useToast().add({ title: 'Descarga iniciada', color: 'green' });
    } catch (error) {
      useToast().add({ title: 'Error al descargar imagen', color: 'red' });
    } finally {
      loading.value[url] = false;
    }
  };

  const isLoading = (url: string) => loading.value[url] || false;

  return {
    copyImage,
    downloadImage,
    isLoading
  };
};
