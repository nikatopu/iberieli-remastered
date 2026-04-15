/**
 * Uploads image to Cloudinary for wine management
 * @param file - The image file to upload
 * @param wineId - The ID of the wine this image belongs to
 * @returns Promise with the uploaded image URL
 */
export async function uploadImageToCloudinary(
  file: File,
  wineId: string,
): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!wineId) {
    throw new Error("Wine ID is required");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (5MB max)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("Image must be less than 5MB");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("wineId", wineId);

  try {
    const response = await fetch(`/api/admin/upload`, {
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
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error instanceof Error ? error : new Error("Upload failed");
  }
}

/**
 * Creates a preview URL for a selected file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Cleans up image preview URL
 */
export function cleanupImagePreview(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
