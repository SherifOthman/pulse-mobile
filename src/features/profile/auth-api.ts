import { API_RUL } from "@/src/config/constants";
import { api } from "@/src/services/api";

const BASE = API_RUL || "http://localhost:5170";

export type User = {
  email: string;
  fullName: string;
  imageUrl: string | null;
};

function toAbsolute(url: string | null): string | null {
  if (!url || !url.startsWith("/uploads/")) return url;
  return `${BASE}${url}`;
}

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return { ...res.data, imageUrl: toAbsolute(res.data.imageUrl) };
};

export const updateMe = async (data: { fullName: string; imageUri?: string | null }) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);

  if (data.imageUri) {
    const filename = data.imageUri.split("/").pop() || "photo.jpg";
    const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    formData.append("image", {
      uri: data.imageUri,
      type: mimeType,
      name: filename,
    } as any);
  }

  const res = await api.put<User>("/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { ...res.data, imageUrl: toAbsolute(res.data.imageUrl) };
};