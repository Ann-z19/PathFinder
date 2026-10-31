import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const ONET_BASE_URL = "https://api-v2.onetcenter.org";
const CODE_PATTERN = /^\d{2}-\d{4}\.\d{2}$/;

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req) => {
    // 1. Read and validate the career code (cheap checks first)
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code || !CODE_PATTERN.test(code)) {
      return Response.json({ error: "Invalid career code" }, { status: 400 });
    }

    // 2. Read the O*NET key from Supabase secrets
    const apiKey = Deno.env.get("ONET_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "Server is missing the O*NET key" }, { status: 500 });
    }

    // 3. Ask O*NET, then translate its answer for the frontend
    const onetResponse = await fetch(`${ONET_BASE_URL}/mnm/careers/${code}/`, {
      headers: { "X-API-Key": apiKey, Accept: "application/json" },
    });
  
    if (onetResponse.status === 422 || onetResponse.status === 404) {
      return Response.json({ error: "Career not found" }, { status: 404 });
    }
    if (!onetResponse.ok) {
      return Response.json({ error: "O*NET request failed" }, { status: 502 });
    }

    const data = await onetResponse.json();
    return Response.json(data);
  }),
};