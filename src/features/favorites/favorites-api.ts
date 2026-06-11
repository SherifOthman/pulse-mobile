import { api } from "@/src/api";

export type FavoriteItem = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  averageRating: number;
  totalRatings: number;
  businessType: number; // 1=Doctor, 2=Pharmacy, 3=Laboratory, 4=Radiology
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  const res = await api.get<FavoriteItem[]>("/favorites");
  return res.data;
};

export const toggleFavorite = (businessId: string) =>
  api.post<void>(`/favorites/${businessId}/toggle`);
