import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const ONET_BASE_URL = "https://api-v2.onetcenter.org";
const CODE_PATTERN = /^\d{2}-\d{4}\.\d{2}$/;
const SECTIONS = ["skills", "education", "job_outlook"]

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

    //3. Ask O*NET for the career AND it's extra sections at the same time
    function askOnet(path: string){
      return fetch(`${ONET_BASE_URL}/mnm/careers/${code}/${path}`,{
        headers: {"X-API-Key": apiKey, Accept: "application/json"}
      })
    }

    //If a section fails, send null instead of failing the whole page
    async function getSection(section: string) {
      const response = await askOnet(section);
      if(!response.ok) return null
      return await response.json()
    }

    const [onetResponse, ...sectionData] = await Promise.all([
      askOnet(""), ...SECTIONS.map((section)=>getSection(section))
    ])

    //4. Translate the answer for the frontend
    if(onetResponse.status === 422 || onetResponse.status === 404){
      return Response.json(
        {error: "Career not found"}, 
        {status: 404}
      )
    }
    if(!onetResponse.ok){
      return Response.json(
        {error: "O*NET request failed"},
        {status: 502}
      )
    }

    //5. Add the sections to the career data
    const data = await onetResponse.json();
    const result = {...data}
    SECTIONS.forEach((section, i)=>{
      result[section] = sectionData[i]
    })
    return Response.json(result)
  }),
};