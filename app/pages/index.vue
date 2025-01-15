<script setup lang="ts">
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  // collection,
  // addDoc,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useFirebaseAuth, useCurrentUser, useFirestore } from "vuefire";

const toast = useToast();

const user = useCurrentUser();
const auth = useFirebaseAuth();
const db = useFirestore();

const route = useRoute();

const error = ref("");

function signinRedirect() {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then(async (response) => {
      // console.log('Usuario', response)
      error.value = "";

      const uid = response.user.uid;
      // console.log('User', uid);

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setDoc(docRef, {
          displayName: user.value?.displayName,
          email: user.value?.email,
          photoURL: user.value?.photoURL,
          date: Timestamp.fromDate(new Date()),
        })
          .then(async () => {
            toast.add({
              color: "green",
              title: `Bienvendido ${user.value?.displayName}`,
            });
            if (route.query.redirect) {
              await navigateTo(route.query.redirect);
            }
          })
          .catch((reason) => {
            toast.add({
              color: "red",
              title: `Error ${reason}`,
            });
            console.error("Failed adding user", reason);
          });
      } else {
        updateDoc(docRef, {
          last_login: Timestamp.fromDate(new Date()),
        })
          .then(async () => {
            toast.add({
              color: "green",
              title: `Bienvendido ${user.value?.displayName}`,
            });
            if (route.query.redirect) {
              await navigateTo(route.query.redirect);
            }
          })
          .catch((reason) => {
            toast.add({
              color: "red",
              title: `Error ${reason}`,
            });
            console.error("Failed updating user", reason);
          });
      }
    })
    .catch((reason) => {
      console.error("Failed signinRedirect", reason);
      error.value = reason;
    });
}

definePageMeta({
  layout: "login",
});
</script>

<template>
  <client-only>
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <!-- <button @click="signinRedirect()">Ingresar</button> -->
      <div v-if="!user" class="flex flex-col gap-4">
        <UAuthForm
          description="Ingresa con tu cuenta de Melborp"
          align="bottom"
          :providers="[
            {
              label: 'Google',
              icon: 'fa fa-brands fa-google',
              color: 'white',
              size: 'lg',
              click: () => {
                signinRedirect();
              },
            },
          ]"
          :loading="false"
          :ui="{
            description: 'text-primary-500 dark:text-primary-400 text-center',
          }"
        />
        <UAlert
          v-if="error"
          :description="error"
          color="red"
          icon="i-heroicons-information-circle-20-solid"
          title="Error ingresando "
        />
      </div>
      <div v-else class="mx-auto flex w-full max-w-sm flex-col gap-2">
        <!-- <pre class="text-xs text-green-500 overflow-hidden">{{ user }}</pre> -->

        <h3 class="text-xl">Bienvenido</h3>
        <div class="border-primary-400 mb-4 flex flex-col gap-2 border-l pl-4">
          <UAvatar v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" size="xl" />
          <div class="flex flex-col gap-2">
            <h2 class="text-3xl">
              {{ user.displayName }}
            </h2>
            <h4 class="text-sm">
              {{ user.email }}
            </h4>
          </div>
        </div>

        <UButton
          :to="route.query.redirect || '/init'"
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
          :loading="auth.loading"
          :disabled="auth.loading"
          @click="auth.signOut()"
        >
          <template #trailing>
            <i class="fa-light fa-right-from-bracket"></i>
          </template>
        </UButton>
      </div>
    </div>
  </client-only>
</template>
