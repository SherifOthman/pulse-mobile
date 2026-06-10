import { useBusinessDetails } from "@/src/features/businesses/hooks/use-business-details";
import type { RadiologyDetailsResponse } from "../radiology-api";

export type { RadiologyDetailsResponse };

export function useRadiologyDetails(id: string) {
  return useBusinessDetails<RadiologyDetailsResponse>("/radiology", "radiology-detail", id);
}
