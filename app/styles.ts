import { StyleSheet } from "react-native";
import { COLORS } from "./themes";


export const style = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  decorCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 8,
    letterSpacing: -1,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    width: '100%',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardHeader: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: 16,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: 9,
    color: COLORS.onSurfaceVariant,
    paddingHorizontal: 12,
    letterSpacing: 2,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    height: 48,
    gap: 8,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    color: COLORS.onSurface,
    fontWeight: '600',
    fontSize: 14,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
 
});