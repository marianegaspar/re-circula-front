import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useAppFonts } from "../../../hooks/use-App-Fonts";
import { COLORS } from "../../themes";

type SelectedItem = {
  id: string;
  label: string;
  quantity: number;
  category?: string;
};

const TIME_PERIODS = [
  { id: "manha", title: "Manhã", range: "08h às 12h" },
  { id: "tarde", title: "Tarde", range: "12h às 18h" },
] as const;

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul.",
    "Ago",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

export default function ColectSchedule() {
  const { fontsLoaded } = useAppFonts();
  const params = useLocalSearchParams<{ selectedItems?: string }>();
  const router = useRouter();

  const selectedItems: SelectedItem[] = React.useMemo(() => {
    try {
      return params.selectedItems ? JSON.parse(params.selectedItems) : [];
    } catch {
      return [];
    }
  }, [params.selectedItems]);

  const today = new Date().toISOString().split("T")[0];

const [date, setDate] = React.useState<string | null>(today);
  const [time, setTime] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState({ date: "", time: "" });

  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const minDate = tomorrow.toISOString().split("T")[0];

  if (!fontsLoaded) return null;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <MaterialIcons name="bolt" size={28} color={COLORS.primary} />
            <Text style={styles.logoText}> ReCircula </Text>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View style={styles.stepLine} />

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Itens</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Data</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirma</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>

          <View style={styles.containerHeader}>
            <MaterialIcons
              name="arrow-back"
              size={22}
              color={COLORS.onSurface}
            />
            <Text style={styles.title}>Agendar Coleta</Text>
          </View>
          <Text style={styles.subtitle}>
            Escolha a data e horário para sua coleta.
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Calendar
            minDate={minDate}
            hideExtraDays
            onDayPress={(day) => {
              setDate(day.dateString);
              if (errors.date) {
                setErrors((current) => ({ ...current, date: "" }));
              }
            }}
            markedDates={date ? { [date]: { selected: true } } : {}}
            theme={{
              todayBackgroundColor: COLORS.primary,
              todayTextColor: "#fff",
              textDayFontFamily: "Manrope-Regular",
              textMonthFontFamily: "Manrope-Bold",
              textDayHeaderFontFamily: "Manrope-SemiBold",
              calendarBackground: COLORS.surfaceContainer,
              dayTextColor: COLORS.onSurface,
              monthTextColor: COLORS.onSurface,
              arrowColor: COLORS.primary,
              textDisabledColor: COLORS.outline,
			selectedDayBackgroundColor:"#a7c3b8",
			selectedDayTextColor: "#003824",
            }}
            style={{ borderRadius: 12 }}
          />
          {errors.date ? (
            <Text style={styles.errorText}>{errors.date}</Text>
          ) : null}
        </View>

        {date ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horário</Text>
            <View style={styles.periodsContainer}>
              {TIME_PERIODS.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodCard,
                    time === period.id ? styles.periodCardActive : null,
                  ]}
                  onPress={() => {
                    setTime(period.id);
                    if (errors.time) {
                      setErrors((current) => ({ ...current, time: "" }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.periodTitle,
                      time === period.id ? styles.periodTitleActive : null,
                    ]}
                  >
                    {period.title}
                  </Text>
                  <Text
                    style={[
                      styles.periodRange,
                      time === period.id ? styles.periodRangeActive : null,
                    ]}
                  >
                    {period.range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.time ? (
              <Text style={styles.errorText}>{errors.time}</Text>
            ) : null}
          </View>
        ) : null}


        <View style={styles.footerActionContainer}>
          <TouchableOpacity
            style={styles.btnPrincipal}
            activeOpacity={0.9}
            onPress={() => {
              const nextErrors = {
                date: date ? "" : "Selecione uma data para continuar.",
                time: time ? "" : "Selecione um horário para continuar.",
              };

              setErrors(nextErrors);

              if (nextErrors.date || nextErrors.time) {
                return;
              }

              // enviar para confirmação com params
              router.push({
                pathname: "/colect/revision",
                params: {
                  selectedItems: JSON.stringify(selectedItems),
                  date: date || "",
                  time:
                    time === "manha"
                      ? "08h às 12h"
                      : time === "tarde"
                        ? "12h às 18h"
                        : "",
                },
              });
            }}
          >
            <Text style={styles.btnPrincipalTexto}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  scrollContent: {},

  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logoText: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginLeft: 8,
    letterSpacing: -1,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Step Indicator
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    alignSelf: "center",
    marginBottom: 40,
    position: "relative",
  },
  stepLine: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "#2d3449",
    zIndex: 0,
  },
  stepWrapper: {
    alignItems: "center",
    zIndex: 1,
    gap: 6,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2d3449",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  stepDotText: {
    color: "#bbcabf",
    fontWeight: "bold",
  },
  stepDotTextActive: {
    color: "#003824",
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#bbcabf",
  },
  stepLabelActive: {
    color: "#4edea3",
  },

  // Content
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800",
    color: "#dae2fd",
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: "#bbcabf",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 14,
  },
  errorText: {
    color: "#FF7A7A",
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    marginTop: 10,
    marginLeft: 4,
  },
  emptyText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#111827",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  itemText: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
  },
  itemQty: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
  },
  periodsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  periodCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  periodCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 18,
  },
  periodTitleActive: {
    color: "#003824",
  },
  periodRange: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    marginTop: 4,
  },
  periodRangeActive: {
    color: "#0b4c38",
  },
  footerActionContainer: {
    marginTop: 32,
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  btnPrincipal: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  btnPrincipalTexto: {
    color: "#003824",
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    fontWeight: "700",
  },
});
