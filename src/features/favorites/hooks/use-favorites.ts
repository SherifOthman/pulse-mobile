import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { toggleFavorite } from "../api/favorites-api";
import type { DoctorResponse, PaginatedResponse } from "../../doctors/api/doctors-api";

export type FavoriteListItem = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  averageRating: number;
  totalRatings: number;
};

type DoctorsInfinite = InfiniteData<PaginatedResponse<DoctorResponse>>;

export function useToggleFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (businessId) => {
      await qc.cancelQueries({ queryKey: ["doctors"] });
      const prev = qc.getQueriesData<DoctorsInfinite>({ queryKey: ["doctors"] });

      qc.setQueriesData<DoctorsInfinite>({ queryKey: ["doctors"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === businessId ? { ...item, isFavorite: !item.isFavorite } : item,
            ),
          })),
        };
      });

      return { prev };
    },
    onError: (_err, businessId, context) => {
      if (context?.prev) {
        for (const [key, data] of context.prev) {
          qc.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
