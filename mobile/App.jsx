import React, { useMemo, useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen.jsx";
import AuthScreen from "./src/features/auth/AuthScreen.jsx";

const SCREENS = {
  home: "home",
  auth: "auth"
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState(SCREENS.home);

  const screenHandlers = useMemo(
    () => ({
      goToAuth: () => setActiveScreen(SCREENS.auth),
      goHome: () => setActiveScreen(SCREENS.home)
    }),
    [setActiveScreen]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ExpoStatusBar style="dark" />
      <View style={styles.screen}>
        {activeScreen === SCREENS.home ? (
          <HomeScreen onPressLogin={screenHandlers.goToAuth} />
        ) : (
          <AuthScreen onBack={screenHandlers.goHome} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
});
