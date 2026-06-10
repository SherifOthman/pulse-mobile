import { env } from "./env";

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${env.apiUrl}${path}`;
}
