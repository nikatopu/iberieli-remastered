export async function uploadImageToCloudinary(
  file: File,
  wineId: string,
): Promise<string> {
  if (!file) throw new Error("No file provided");
  if (!wineId) throw new Error("Wine ID is required");
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be less than 5MB");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("wineId", wineId);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

export function cleanupImagePreview(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
