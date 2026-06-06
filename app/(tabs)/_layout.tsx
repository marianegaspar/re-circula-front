import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";

export default function TabLayout() {
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        //cor do icone ativo
        tabBarActiveTintColor: COLORS.primary,

        //cor do icone inativo
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,

        //fundo da barra
        tabBarStyle: {
          backgroundColor: COLORS.surfaceContainer,
          paddingBottom: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: "Manrope-Regular",
          lineHeight: 18,
          paddingBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="colect"
        options={{
          title: "COLETA",

          tabBarIcon: ({ color }) => (
            <MaterialIcons name="recycling" size={24} color={color} />
          ),
        }}
      />

        <Tabs.Screen
        name="rewards"
        options={{
          title: "RECOMPENSAS",

          tabBarIcon: ({ color }) => (
            <MaterialIcons name="star" size={24} color={color} />
          ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: "PERFIL",

          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="collection-points"
        options={{
          href: null,
        }}
      />

      
    </Tabs>
  );
}
