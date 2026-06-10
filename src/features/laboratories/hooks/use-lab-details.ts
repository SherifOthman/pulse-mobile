import { useBusinessDetails } from "@/src/features/businesses/hooks/use-business-details";
import type { LabDetailsResponse } from "../labs-api";

export type { LabDetailsResponse };

export function useLabDetails(id: string) {
  return useBusinessDetails<LabDetailsResponse>("/labs", "lab", id);
}
