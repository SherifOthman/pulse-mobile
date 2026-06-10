import { useBusinessList } from "@/src/features/businesses/hooks/use-business-list";
import type { RadiologyQuery, RadiologyResponse } from "../radiology-api";

export type { RadiologyQuery, RadiologyResponse };

export function useRadiology(query: RadiologyQuery = {}) {
  return useBusinessList<RadiologyResponse>("/radiology", "radiology", query);
}
