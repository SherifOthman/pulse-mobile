import { Button } from "heroui-native";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeToggle() {
  const { theme } = useUniwind();

  return (
    <Button
      onPress={() => Uniwind.setTheme(theme === "light" ? "dark" : "light")}
    >
      Toggle {theme === "light" ? "Dark" : "Light"} Mode
    </Button>
  );
}
