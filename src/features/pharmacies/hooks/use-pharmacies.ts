import { useBusinessList } from "@/src/features/businesses/hooks/use-business-list";
import type { PharmaciesQuery, PharmacyResponse } from "../pharmacies-api";

export type { PharmaciesQuery, PharmacyResponse };

export function usePharmacies(query: PharmaciesQuery = {}) {
  return useBusinessList<PharmacyResponse>("/pharmacies", "pharmacies", query);
}
