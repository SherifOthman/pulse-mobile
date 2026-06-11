import { api } from "@/src/api";
import { env } from "@/src/env";

function toAbsolute(url: string | null): string | null {
  if (!url || !url.startsWith("/uploads/")) return url;
  return `${env.baseUrl}${url}`;
}

export type User = {
  email: string;
  fullName: string;
  imageUrl: string | null;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return { ...res.data, imageUrl: toAbsolute(res.data.imageUrl) };
};

export const updateMe = async (data: { fullName: string; imageUri?: string | null }) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);

  if (data.imageUri) {
    const name = data.imageUri.split("/").pop() || "photo.jpg";
    const ext = name.split(".").pop()?.toLowerCase() || "jpg";
    const mime: Record<string, string> = { png: "image/png", webp: "image/webp" };

    formData.append("image", {
      uri: data.imageUri,
      type: mime[ext] || "image/jpeg",
      name,
    } as any);
  }

  const res = await api.put<User>("/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { ...res.data, imageUrl: toAbsolute(res.data.imageUrl) };
};
