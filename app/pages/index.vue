<script setup lang="ts">
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Timestamp, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebaseAuth, useCurrentUser, useFirestore } from "vuefire";

// Composables
const toast = useToast();
const user = useCurrentUser();
const auth = useFirebaseAuth();
const db = useFirestore();
const route = useRoute();

// State
const error = ref("");
const isLoading = ref(false);

// Auth handling
async function signinRedirect() {
  if (!auth) return;

  isLoading.value = true;
  error.value = "";

  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);

    if (!response.user) throw new Error("No user data received");

    const uid = response.user.uid;
    const docRef = doc(db, "users", uid);

    try {
      const docSnap = await getDoc(docRef);
      const userData = {
        displayName: user.value?.displayName,
        email: user.value?.email,
        photoURL: user.value?.photoURL,
        last_login: Timestamp.fromDate(new Date()),
      };

      if (!docSnap.exists()) {
        // New user
        await setDoc(docRef, {
          ...userData,
          date: Timestamp.fromDate(new Date()),
        });
      } else {
        // Existing user
        await updateDoc(docRef, userData);
      }

      toast.add({
        color: "green",
        title: `Bienvenido ${user.value?.displayName}`,
      });

      // Handle redirect
      if (route.query.redirect) {
        await navigateTo(route.query.redirect.toString());
      }
    } catch (e) {
      console.error("Database operation failed:", e);
      toast.add({
        color: "red",
        title: "Error al guardar datos de usuario",
        description: "Por favor intente de nuevo",
      });
    }
  } catch (e) {
    console.error("Authentication failed:", e);
    error.value = e instanceof Error ? e.message : "Error de autenticación";
    toast.add({
      color: "red",
      title: "Error de autenticación",
      description: "Por favor intente de nuevo",
    });
  } finally {
    isLoading.value = false;
  }
}

// Page meta
definePageMeta({
  layout: "login",
});
</script>

<template>
  <ClientOnly>
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <template v-if="!user">
        <UAuthForm
          description="Ingresa con tu cuenta de Melborp"
          align="bottom"
          :providers="[
            {
              label: 'Google',
              icon: 'fa fa-brands fa-google',
              color: 'white',
              size: 'lg',
              click: signinRedirect,
            },
          ]"
          :loading="isLoading"
          :ui="{
            description: 'text-primary-500 dark:text-primary-400 text-center',
          }"
        />

        <UAlert
          v-if="error"
          :description="error"
          color="red"
          icon="i-heroicons-information-circle-20-solid"
          title="Error de autenticación"
        />
      </template>

      <template v-else>
        <div class="mx-auto flex w-full max-w-sm flex-col gap-2">
          <h3 class="text-xl">Bienvenido</h3>

          <div class="border-primary-400 mb-4 flex flex-col gap-2 border-l pl-4">
            <UAvatar v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" size="xl" />
            <div class="flex flex-col gap-2">
              <h2 class="text-3xl">{{ user.displayName }}</h2>
              <h4 class="text-sm">{{ user.email }}</h4>
            </div>
          </div>

          <UButton
            :to="route.query.redirect?.toString() || '/init'"
            class="mr-auto flex w-auto gap-8"
            label="Ingresar"
            color="gray"
            size="xl"
          >
            <template #trailing>
              <i class="fa-light fa-right-to-bracket"></i>
            </template>
          </UButton>

          <UButton
            class="mr-auto flex w-auto"
            label="Salir"
            color="gray"
            :loading="isLoading"
            :disabled="isLoading"
            @click="auth.signOut()"
          >
            <template #trailing>
              <i class="fa-light fa-right-from-bracket"></i>
            </template>
          </UButton>
        </div>
      </template>
    </div>
  </ClientOnly>
</template>
