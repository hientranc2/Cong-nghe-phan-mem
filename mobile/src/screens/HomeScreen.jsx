import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HomeHeader from "../components/HomeHeader.jsx";
import BestSellerSection from "../components/BestSellerSection.jsx";
import FloatingCartButton from "../components/FloatingCartButton.jsx";
import BottomTabBar from "../components/BottomTabBar.jsx";

const HomeScreen = ({ onPressLogin }) => (
  <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content}>
      <HomeHeader onLoginPress={onPressLogin} />
      <BestSellerSection />
    </ScrollView>
    <FloatingCartButton />
    <BottomTabBar />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff8f2",
  },
  content: {
    paddingBottom: 180,
  },
});

export default HomeScreen;
