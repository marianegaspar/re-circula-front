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
  form: {
    marginTop: 32,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
   
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    color: COLORS.onSurface,
    
    borderWidth: 1,
    borderColor: COLORS.outline + '20',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.outline + '20',
  },
  inputPassword: {
    flex: 1,
    height: 56,
    color: COLORS.onSurface,
   
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnPrimaryText: {
   fontFamily:'Manrope-Bold',
    color: COLORS.onPrimary,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.outline + '20',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 10,
   
    color: COLORS.onSurfaceVariant,
  },
  btnGoogle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLowest,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.outline + '20',
  },
  btnGoogleText: {
  
    color: COLORS.onSurface,
    fontSize: 14,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,
    
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    width: '100%',
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 20,
    borderLeftWidth: 2,
  },
  leafLeft: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  leafRight: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricLabel: {
    fontSize: 9,
    
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 24,
    
    color: COLORS.onSurface,
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  }


  
});