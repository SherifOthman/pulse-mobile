import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../reviews-api";

/**
 * Mutation hook for submitting a review.
 * Accepts the exact queryKey of the business detail query so it
 * invalidates only that one entry instead of all business types.
 */
export function useSubmitReview(queryKey: readonly [string, string]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rating, text, businessId }: { businessId: string; rating: number; text: string }) =>
      createReview(businessId, rating, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
