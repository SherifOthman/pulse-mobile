import { api } from "@/src/services/api";

export type FilterOption = {
  id: string;
  name: string;
};

export type CityOption = FilterOption & {
  governorateId: string;
};

export const getGovernorates = async (): Promise<FilterOption[]> => {
  const res = await api.get<FilterOption[]>("/governorates");
  return res.data;
};

export const getCities = async (governorateId?: string): Promise<CityOption[]> => {
  const res = await api.get<CityOption[]>("/cities", {
    params: governorateId ? { governorateId } : undefined,
  });
  return res.data;
};

export const getSpecializations = async (): Promise<FilterOption[]> => {
  const res = await api.get<FilterOption[]>("/specializations");
  return res.data;
};
