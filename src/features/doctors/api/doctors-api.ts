import { api } from "@/src/services/api";

export type DoctorResponse = {
  id: string;
  name: string;
  specialization: string;
  profileImageUrl: string | null;
  visitPrice: number;
  governorate: string;
  averageRating: number;
  totalRatings: number;
  isOpen: boolean;
  todayStart: string | null;
  todayEnd: string | null;
  nextDayOfWeek: number | null;
  nextStart: string | null;
  nextEnd: string | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
};

export type DoctorsQuery = {
  governorateId?: string;
  cityId?: string;
  name?: string;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  gender?: number;
  specializationId?: string;
};

export const getDoctors = async (query: DoctorsQuery = {}) => {
  const res = await api.get<PaginatedResponse<DoctorResponse>>("/doctors", {
    params: query,
  });
  return res.data;
};
