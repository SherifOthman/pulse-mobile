import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";

export type FavoriteListItem = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  averageRating: number;
  totalRatings: number;
};

type FavoritesData = { favorites: FavoriteListItem[] };

const getFavorites = async (): Promise<FavoritesData> => {
  const res = await api.get<FavoritesData>("/favorites");
  return res.data;
};

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 60_000,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      const current = qc.getQueryData<FavoritesData>(["favorites"]);
      const isFav = current?.favorites?.some((d) => d.id === businessId);
      if (isFav) {
        await api.delete(`/favorites/${businessId}`);
      } else {
        await api.post(`/favorites/${businessId}`);
      }
      return { businessId, wasFavorite: !!isFav };
    },
    onMutate: async (businessId) => {
      await qc.cancelQueries({ queryKey: ["favorites"] });
      const prev = qc.getQueryData<FavoritesData>(["favorites"]);

      qc.setQueryData<FavoritesData>(["favorites"], (old) => {
        if (!old) return { favorites: [] };
        const favorites = old.favorites ?? [];
        const isFav = favorites.some((d) => d.id === businessId);
        if (isFav) {
          // Remove optimistically
          return { favorites: favorites.filter((d) => d.id !== businessId) };
        } else {
          // Add placeholder — name/image filled in after refetch
          return { favorites: [...favorites, { id: businessId, name: "", profileImageUrl: null, averageRating: 0, totalRatings: 0 }] };
        }
      });

      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) qc.setQueryData(["favorites"], context.prev);
    },
    onSuccess: ({ wasFavorite }) => {
      // After adding, refetch to replace placeholder with real data
      if (!wasFavorite) qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
