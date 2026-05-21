import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";

export default function ProfileScreen() {
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }

  const MyTabs = createBottomTabNavigator({
    screens: {
      Home: ProfileScreen,
    },
  });

  return <View></View>;
}
