import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, toggleFavorite } from "../favorites-api";

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 30_000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleFavorite(id),
    onSuccess: (_data, businessId) => {
      // Invalidate the specific detail cache + the favorites list
      queryClient.invalidateQueries({ queryKey: ["doctor",           businessId] });
      queryClient.invalidateQueries({ queryKey: ["pharmacy",         businessId] });
      queryClient.invalidateQueries({ queryKey: ["lab",              businessId] });
      queryClient.invalidateQueries({ queryKey: ["radiology-detail", businessId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
