/**
 * Upload general image (e.g., from tiptap editor)
 * @param file - File to upload
 * @returns Promise with upload response containing URL
 */
export async function uploadGeneralImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/general-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Upload failed");
  }

  return response.json();
}
