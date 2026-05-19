import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from "react";
import { COLORS } from '../themes';

export default function TabLayout() {
    return(
        <Tabs 
        screenOptions={{headerShown:false,

            //cor do icone ativo
            tabBarActiveTintColor:COLORS.primary,

            //cor do icone inativo
            tabBarInactiveTintColor:COLORS.onSurfaceVariant,

            //fundo da barra
            tabBarStyle:{
               backgroundColor:COLORS.surfaceContainer,
            }
        }}>
            <Tabs.Screen name="home" options={{title: "Home",

            tabBarIcon:({color, focused}) =>(
                <Ionicons
                name={focused ? 'home': 'home-outline'}
                size={24}
                color={color}
                />
            )

            }}/>

        </Tabs>
    )

}

