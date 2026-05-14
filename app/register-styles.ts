import { StyleSheet } from 'react-native';
import { COLORS } from "./themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary + '10', // 10% opacidade
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primaryContainer + '15',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

logoText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: COLORS.primary,
    letterSpacing: -1,
  },
 
  titleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

 heroTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 36,
    color: COLORS.onSurface,
    textAlign: 'center',
    lineHeight: 42,
  },

  heroSubtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

card: {
    backgroundColor: COLORS.surfaceContainer + '95', // Backdrop blur fake
    width: '100%',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

cardTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: COLORS.onSurface,
  },

  cardSubtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },



  
});