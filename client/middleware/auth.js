export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState("user")
  const token = useCookie("token")

  if (!user.value && !token.value && to.path !== "/login") {
    return navigateTo("/login")
  }
})
