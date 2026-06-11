import { Stack } from "expo-router";

export default function RewardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index-rewards" />
      <Stack.Screen name="how-it-works" />
      
    </Stack>
  );
}