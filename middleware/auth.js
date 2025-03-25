import supabase from "~/plugins/supabase";

export default defineNuxtRouteMiddleware(async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return navigateTo('/login');
  }
});
