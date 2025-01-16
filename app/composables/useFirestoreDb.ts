// composables/useFirestoreDb.ts
import {
  Firestore,
  collection,
  doc,
  type DocumentData,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";
import type { Client } from "@/types/Client";

export const useFirestoreDb = () => {
  const db = useFirestore();
  const loaded = ref(false);
  const error = ref<Error | null>(null);

  const getClients = () => {
    const clientsCol = useCollection(collection(db as Firestore, "dco"), { wait: true });

    const clients = computed(() => {
      try {
        if (!clientsCol.value) return [];

        return clientsCol.value.map((client) => ({
          id: client.id,
          ...client,
        })) as Client[];
      } catch (e) {
        error.value = e as Error;
        return [];
      }
    });

    return {
      clients,
      loaded,
      error,
    };
  };

  return {
    db,
    getClients,
  };
};
