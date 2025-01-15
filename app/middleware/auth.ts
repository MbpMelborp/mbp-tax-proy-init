// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const user = await getCurrentUser()
  // console.log('User middelware:', user);
  // redirect the user to the login page
  if (!user) {
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
