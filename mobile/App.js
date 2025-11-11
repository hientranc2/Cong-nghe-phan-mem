import React from "react";
import { SafeAreaView, StatusBar, ScrollView, View, StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import HomeHeader from "./src/components/HomeHeader";
import BestSellerSection from "./src/components/BestSellerSection";
import FloatingCartButton from "./src/components/FloatingCartButton";
import BottomTabBar from "./src/components/BottomTabBar";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ExpoStatusBar style="dark" />
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <HomeHeader />
          <BestSellerSection />
        </ScrollView>
        <FloatingCartButton />
        <BottomTabBar />
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
  content: {
    paddingBottom: 180,
  },
});
