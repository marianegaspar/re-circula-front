import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold
} from '@expo-google-fonts/inter';
import {
    Manrope_400Regular,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    useFonts
} from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Impede que a tela de splash suma sozinha
SplashScreen.preventAutoHideAsync();

export function useAppFonts() {
  const [fontsLoaded, error] = useFonts({
    'Manrope-Regular': Manrope_400Regular,
    'Manrope-Bold': Manrope_700Bold,
    'Manrope-ExtraBold': Manrope_800ExtraBold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      // Quando carregar (ou der erro), escondemos a splash
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  return { fontsLoaded, error };
}