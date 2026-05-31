import { useInfiniteQuery } from "@tanstack/react-query";
import { getDoctors, DoctorsQuery } from "../api/doctors-api";

export function useDoctors(query: DoctorsQuery = {}) {
  const { pageSize = 20, ...filters } = query;

  return useInfiniteQuery({
    queryKey: ["doctors", filters],
    queryFn: ({ pageParam = 1 }) =>
      getDoctors({ ...filters, page: pageParam, pageSize }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}
