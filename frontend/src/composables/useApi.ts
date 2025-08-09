export const useApi = () => {
  const apiFetch = $fetch.create({ baseURL: process.env.NUXT_BACKEND_HOST })

  return apiFetch
}