const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/onet-proxy`
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Ask our onet-proxy Edge Function for one career.
// Returns { career } on success, or { error } on failure.
export async function fetchCareer(code) {
  const url = new URL(PROXY_URL)
  url.searchParams.set("code", code)

  try {
    const response = await fetch(url, {
      headers: { apikey: PUBLISHABLE_KEY },
    })
    const body = await response.json()
    if (!response.ok) {
      return { error: body.error ?? "Something went wrong" }
    }
    return { career: body }
  } catch {
    // fetch itself failed: no internet, or the proxy could not be reached
    return { error: "Could not reach the server" }
  }
}