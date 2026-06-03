import { useQuery } from "@tanstack/react-query";
import {
  BottomSheet,
  Button,
  Select,
  Typography,
} from "heroui-native";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { getCities, getGovernorates, getSpecializations } from "../../api/filters-api";

export type FilterState = {
  governorateId: string | undefined;
  cityId: string | undefined;
  specializationId: string | undefined;
  gender: number | undefined;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
};

export function FilterBottomSheet({ isOpen, onOpenChange, filters, onApply }: Props) {
  const [governorateId, setGovernorateId] = useState<string | undefined>(filters.governorateId);
  const [cityId, setCityId] = useState<string | undefined>(filters.cityId);
  const [specializationId, setSpecializationId] = useState<string | undefined>(filters.specializationId);
  const [gender, setGender] = useState<number | undefined>(filters.gender);

  const { data: governorates } = useQuery({
    queryKey: ["governorates"],
    queryFn: getGovernorates,
  });

  const { data: cities } = useQuery({
    queryKey: ["cities", governorateId],
    queryFn: () => getCities(governorateId),
    enabled: !!governorateId,
  });

  const { data: specializations } = useQuery({
    queryKey: ["specializations"],
    queryFn: getSpecializations,
  });

  const selectedGovernorate = governorates?.find((g) => g.id === governorateId);

  const handleApply = useCallback(() => {
    onApply({ governorateId, cityId, specializationId, gender });
    onOpenChange(false);
  }, [governorateId, cityId, specializationId, gender, onApply, onOpenChange]);

  const handleReset = useCallback(() => {
    setGovernorateId(undefined);
    setCityId(undefined);
    setSpecializationId(undefined);
    setGender(undefined);
  }, []);

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="px-4 py-2 gap-6">
            <View className="flex-row-reverse items-center justify-between">
              <BottomSheet.Close />
              <Typography.Heading type="h3">تصفية</Typography.Heading>
              <Pressable onPress={handleReset}>
                <Typography.Paragraph type="body-sm">إعادة تعيين</Typography.Paragraph>
              </Pressable>
            </View>

            <Select value={selectedGovernorate ? { value: selectedGovernorate.id, label: selectedGovernorate.name } : undefined} onValueChange={(opt) => { setGovernorateId(opt?.value); setCityId(undefined); }}>
              <Select.Trigger className="flex-row-reverse">
                <Select.Value placeholder="المحافظة" className="text-right flex-1" />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="popover" width="trigger">
                  {governorates?.map((g) => (
                    <Select.Item key={g.id} value={g.id} label={g.name}>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            <Select
              value={cityId && cities?.find((c) => c.id === cityId) ? { value: cityId, label: cities.find((c) => c.id === cityId)!.name } : undefined}
              onValueChange={(opt) => setCityId(opt?.value)}
              isDisabled={!governorateId}
            >
              <Select.Trigger className="flex-row-reverse">
                <Select.Value placeholder="المدينة" className="text-right flex-1" />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="popover" width="trigger">
                  {cities?.map((c) => (
                    <Select.Item key={c.id} value={c.id} label={c.name}>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            <Select
              value={specializationId && specializations?.find((s) => s.id === specializationId) ? { value: specializationId, label: specializations.find((s) => s.id === specializationId)!.name } : undefined}
              onValueChange={(opt) => setSpecializationId(opt?.value)}
            >
              <Select.Trigger className="flex-row-reverse">
                <Select.Value placeholder="التخصص" className="text-right flex-1" />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="popover" width="trigger">
                  {specializations?.map((s) => (
                    <Select.Item key={s.id} value={s.id} label={s.name}>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            <View className="flex-row-reverse gap-4">
              <Button
                variant={gender === 0 ? "primary" : "outline"}
                className="flex-1"
                onPress={() => setGender(gender === 0 ? undefined : 0)}
              >
                ذكر
              </Button>
              <Button
                variant={gender === 1 ? "primary" : "outline"}
                className="flex-1"
                onPress={() => setGender(gender === 1 ? undefined : 1)}
              >
                أنثى
              </Button>
            </View>

            <Button onPress={handleApply}>تطبيق</Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
