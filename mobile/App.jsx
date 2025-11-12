import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen.jsx";
import AuthScreen from "./src/features/auth/AuthScreen.jsx";
import { CartProvider } from "./src/context/CartContext.jsx";

const SCREENS = {
  home: "home",
  auth: "auth"
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState(SCREENS.home);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const goToAuth = useCallback(
    () => setActiveScreen(SCREENS.auth),
    [setActiveScreen]
  );
  const goHome = useCallback(
    () => setActiveScreen(SCREENS.home),
    [setActiveScreen]
  );
  const handleLoginSuccess = useCallback(
    (user) => {
      if (user) {
        setAuthenticatedUser({
          fullName: user.fullName,
          phone: user.phone,
          email: user.email
        });
      } else {
        setAuthenticatedUser(null);
      }
      setActiveScreen(SCREENS.home);
    },
    [setActiveScreen, setAuthenticatedUser]
  );

  const screenHandlers = useMemo(
    () => ({
      goToAuth,
      goHome,
      handleLoginSuccess
    }),
    [goHome, goToAuth, handleLoginSuccess]
  );

  return (
    <CartProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ExpoStatusBar style="dark" />
        <View style={styles.screen}>
          {activeScreen === SCREENS.home ? (
            <HomeScreen
              onPressLogin={screenHandlers.goToAuth}
              user={authenticatedUser}
            />
          ) : (
            <AuthScreen
              onBack={screenHandlers.goHome}
              onLoginSuccess={screenHandlers.handleLoginSuccess}
            />
          )}
        </View>
      </SafeAreaView>
    </CartProvider>
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
