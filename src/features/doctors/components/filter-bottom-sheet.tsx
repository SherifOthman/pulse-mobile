import {
  BottomSheet,
  Button,
  Label,
  Radio,
  RadioGroup,
  Select,
} from "heroui-native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import {
  useCities,
  useGovernorates,
  useSpecializations,
} from "../hooks/use-filters";

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

export function FilterBottomSheet({
  isOpen,
  onOpenChange,
  filters,
  onApply,
}: Props) {
  const [governorateId, setGovernorateId] = useState(filters.governorateId);
  const [cityId, setCityId] = useState(filters.cityId);
  const [specializationId, setSpecializationId] = useState(
    filters.specializationId,
  );
  const [gender, setGender] = useState(filters.gender);

  const { data: governorates } = useGovernorates();
  const { data: cities } = useCities(governorateId);
  const { data: specializations } = useSpecializations();

  const selectedGovernorate = governorates?.find((g) => g.id === governorateId);
  const selectedCity = cities?.find((c) => c.id === cityId);
  const selectedSpecialization = specializations?.find(
    (s) => s.id === specializationId,
  );

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
            {/* Header */}
            <View className="flex-row-reverse items-center justify-between">
              <BottomSheet.Close />
              <BottomSheet.Title>تصفية</BottomSheet.Title>
              <Button variant="ghost" size="sm" onPress={handleReset}>
                إعادة تعيين
              </Button>
            </View>

            {/* Governorate */}
            <Select
              presentation="dialog"
              value={
                selectedGovernorate
                  ? {
                      value: selectedGovernorate.id,
                      label: selectedGovernorate.name,
                    }
                  : undefined
              }
              onValueChange={(opt) => {
                setGovernorateId(opt?.value);
                setCityId(undefined);
              }}
            >
              <Select.Trigger className="flex-row-reverse">
                <Select.Value
                  placeholder="المحافظة"
                  className="text-right flex-1"
                />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="dialog">
                  {governorates?.map((g) => (
                    <Select.Item key={g.id} value={g.id} label={g.name}>
                      <Select.ItemIndicator />
                      <Select.ItemLabel />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            {/* City */}
            <Select
              presentation="dialog"
              value={
                selectedCity
                  ? { value: selectedCity.id, label: selectedCity.name }
                  : undefined
              }
              onValueChange={(opt) => setCityId(opt?.value)}
              isDisabled={!governorateId}
            >
              <Select.Trigger className="flex-row-reverse">
                <Select.Value
                  placeholder="المدينة"
                  className="text-right flex-1"
                />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="dialog">
                  {cities?.map((c) => (
                    <Select.Item key={c.id} value={c.id} label={c.name}>
                      <Select.ItemIndicator />
                      <Select.ItemLabel />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            {/* Specialization */}
            <Select
              presentation="dialog"
              value={
                selectedSpecialization
                  ? {
                      value: selectedSpecialization.id,
                      label: selectedSpecialization.name,
                    }
                  : undefined
              }
              onValueChange={(opt) => setSpecializationId(opt?.value)}
            >
              <Select.Trigger className="flex-row-reverse">
                <Select.Value
                  placeholder="التخصص"
                  className="text-right flex-1"
                />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content presentation="dialog">
                  {specializations?.map((s) => (
                    <Select.Item key={s.id} value={s.id} label={s.name}>
                      <Select.ItemIndicator />
                      <Select.ItemLabel />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>

            {/* Gender — RadioGroup instead of manual toggle buttons */}
            <RadioGroup
              value={gender?.toString()}
              onValueChange={(val) =>
                setGender(gender?.toString() === val ? undefined : Number(val))
              }
              className="flex-row-reverse gap-4"
            >
              <RadioGroup.Item
                value="0"
                className="flex-1 flex-row-reverse justify-between border border-border rounded-lg px-3 py-2.5"
              >
                <Label>ذكر</Label>
                <Radio />
              </RadioGroup.Item>
              <RadioGroup.Item
                value="1"
                className="flex-1 flex-row-reverse justify-between border border-border rounded-lg px-3 py-2.5"
              >
                <Label>أنثى</Label>
                <Radio />
              </RadioGroup.Item>
            </RadioGroup>

            <Button onPress={handleApply}>تطبيق</Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
