import { uploadGeneralImageAction } from "@/lib/apis/server/actions/upload.actions";
import { proxyRoute } from "@/lib/proxy-route";

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  return proxyRoute(() => uploadGeneralImageAction(file));
};
