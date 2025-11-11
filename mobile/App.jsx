import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("home");

  const handleOpenAuth = () => setActiveScreen("auth");
  const handleCloseAuth = () => setActiveScreen("home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ExpoStatusBar style="dark" />
      <View style={styles.screen}>
        {activeScreen === "home" ? (
          <HomeScreen onLoginPress={handleOpenAuth} />
        ) : (
          <AuthScreen onClose={handleCloseAuth} />
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
    position: "relative",
    backgroundColor: "#fff8f2",
  },
});
