import { Button } from "heroui-native";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-500">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Button onPress={() => console.log("Get Started pressed!")}>
        Get Started
      </Button>
    </View>
  );
}
