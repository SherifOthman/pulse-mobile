import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviews } from "../reviews-api";

export function useReviews(businessId: string) {
  return useInfiniteQuery({
    queryKey: ["reviews", businessId],
    queryFn: ({ pageParam = 1 }) => getReviews(businessId, pageParam as number),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!businessId,
  });
}
