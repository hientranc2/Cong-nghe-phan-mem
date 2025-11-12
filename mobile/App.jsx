import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen.jsx";
import AuthScreen from "./src/features/auth/AuthScreen.jsx";
import CartScreen from "./src/screens/CartScreen.jsx";
import CheckoutScreen from "./src/screens/CheckoutScreen.jsx";
import OrderConfirmationScreen from "./src/screens/OrderConfirmationScreen.jsx";
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen.jsx";
import { CartProvider } from "./src/context/CartContext.jsx";

const SCREENS = {
  home: "home",
  auth: "auth",
  cart: "cart",
  checkout: "checkout",
  orderConfirmation: "orderConfirmation",
  orderTracking: "orderTracking",
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState(SCREENS.home);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  const goToAuth = useCallback(
    () => setActiveScreen(SCREENS.auth),
    [setActiveScreen]
  );
  const goHome = useCallback(() => setActiveScreen(SCREENS.home), [setActiveScreen]);
  const goToCart = useCallback(() => setActiveScreen(SCREENS.cart), [setActiveScreen]);
  const goToCheckout = useCallback(
    () => setActiveScreen(SCREENS.checkout),
    [setActiveScreen]
  );
  const goToOrderConfirmation = useCallback(
    () => setActiveScreen(SCREENS.orderConfirmation),
    [setActiveScreen]
  );
  const goToOrderTracking = useCallback(
    () => setActiveScreen(SCREENS.orderTracking),
    [setActiveScreen]
  );
  const handleLoginSuccess = useCallback(
    (user) => {
      if (user) {
        setAuthenticatedUser({
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
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
      goToCart,
      goToCheckout,
      handleLoginSuccess,
      goToOrderTracking,
    }),
    [goHome, goToAuth, goToCart, goToCheckout, goToOrderTracking, handleLoginSuccess]
  );

  const handleOrderPlaced = useCallback(
    (order) => {
      if (order) {
        setLastOrder(order);
        goToOrderConfirmation();
      } else {
        setLastOrder(null);
        goHome();
      }
    },
    [goHome, goToOrderConfirmation]
  );

  const handleTrackOrder = useCallback(() => {
    if (!lastOrder) {
      goHome();
      return;
    }

    goToOrderTracking();
  }, [goHome, goToOrderTracking, lastOrder]);

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
              onViewCart={screenHandlers.goToCart}
            />
          ) : activeScreen === SCREENS.auth ? (
            <AuthScreen
              onBack={screenHandlers.goHome}
              onLoginSuccess={screenHandlers.handleLoginSuccess}
            />
          ) : activeScreen === SCREENS.cart ? (
            <CartScreen
              onBack={screenHandlers.goHome}
              onCheckout={screenHandlers.goToCheckout}
            />
          ) : activeScreen === SCREENS.checkout ? (
            <CheckoutScreen
              onBack={screenHandlers.goHome}
              user={authenticatedUser}
              onOrderPlaced={handleOrderPlaced}
            />
          ) : activeScreen === SCREENS.orderTracking ? (
            <OrderTrackingScreen
              order={lastOrder}
              onBack={goToOrderConfirmation}
            />
          ) : (
            <OrderConfirmationScreen
              onBack={screenHandlers.goHome}
              onViewOrders={screenHandlers.goHome}
              onTrackOrder={handleTrackOrder}
              order={lastOrder}
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
