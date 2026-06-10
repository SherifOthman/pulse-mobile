import { useBusinessList } from "@/src/features/businesses/hooks/use-business-list";
import type { LabResponse, LabsQuery } from "../labs-api";

export type { LabResponse, LabsQuery };

export function useLabs(query: LabsQuery = {}) {
  return useBusinessList<LabResponse>("/labs", "labs", query);
}
