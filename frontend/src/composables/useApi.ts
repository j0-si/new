export const useApi = () => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: runtimeConfig.public.backendHost
  })

  return apiFetch;
}