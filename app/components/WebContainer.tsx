import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type WebContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const WEB_CONTAINER_MAX_WIDTH = 560;

export function WebContainer({ children, style }: WebContainerProps) {
  return (
    <View style={[styles.base, Platform.OS === "web" && styles.web, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
  },
  web: {
    maxWidth: WEB_CONTAINER_MAX_WIDTH,
    alignSelf: "center",
  },
});
