import { useInfiniteQuery } from "@tanstack/react-query";
import { getDoctors, type DoctorResponse, type DoctorsQuery } from "../api/doctors-api";

// Re-export so consumers can import from the hook file
export type { DoctorResponse, DoctorsQuery };

export function useDoctors(query: DoctorsQuery = {}) {
  return useInfiniteQuery({
    queryKey: ["doctors", query],
    queryFn: ({ pageParam = 1 }) =>
      getDoctors({ ...query, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,
  });
}
