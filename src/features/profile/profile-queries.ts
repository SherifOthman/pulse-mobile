import { useQuery } from "@tanstack/react-query";
import { getMe } from "./profile-api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
}
