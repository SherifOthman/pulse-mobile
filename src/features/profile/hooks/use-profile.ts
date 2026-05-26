import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "../api/profile-api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
}
