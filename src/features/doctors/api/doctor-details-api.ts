import { api } from "@/src/api";
import type { BusinessDetails } from "@/src/types";

/** Doctor-specific detail fields on top of BusinessDetails */
export type DoctorDetailsResponse = BusinessDetails & {
  specialization: string;
  visitPrice: number | null;
};

export const getDoctorDetails = async (id: string): Promise<DoctorDetailsResponse> => {
  const res = await api.get<DoctorDetailsResponse>(`/doctors/${id}`);
  return res.data;
};

// Re-export shared detail sub-types so consumers don't need to import from types.ts
export type { BranchDetail, PhoneNumberDetail, WorkingDayDetail } from "@/src/types";
