import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";

export default function HowItWorks(){
    const router = useRouter();
    const { fontsLoaded } = useAppFonts();
    
      if (!fontsLoaded) {
        return null;
      }

    return(
           <ScrollView
             contentContainerStyle={styles.scrollContent}
             showsVerticalScrollIndicator={false}
           >
             <View style={styles.container}>
               <View style={styles.header}>
                 <TouchableOpacity
                   style={styles.backButton}
                   activeOpacity={0.8}
                   onPress={() => router.back()}
                 >
                 <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
                 </TouchableOpacity>
                 
                   <Text style={styles.title}>Como Funciona</Text>
              
               </View>
            </View>
            </ScrollView>
       
    )
};

const styles = StyleSheet.create({
    scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
      header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800", 
    color: COLORS.onSurface,
   
  },
    backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainer,
  },
})