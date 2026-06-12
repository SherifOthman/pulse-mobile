import { api } from "@/src/api";
import type { BusinessListItem, BusinessQuery, PaginatedResponse } from "@/src/types";

/** Doctor-specific list fields on top of BusinessListItem */
export type DoctorResponse = BusinessListItem & {
  specialization: string;
  visitPrice: number | null;
};

export type DoctorsQuery = BusinessQuery & {
  gender?: number;
  specializationId?: string;
};

export const getDoctors = async (query: DoctorsQuery = {}): Promise<PaginatedResponse<DoctorResponse>> => {
  const res = await api.get<PaginatedResponse<DoctorResponse>>("/doctors", { params: query });
  return res.data;
};
