import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import HomeHeader from "../components/HomeHeader";
import BestSellerSection from "../components/BestSellerSection";
import FloatingCartButton from "../components/FloatingCartButton";
import BottomTabBar from "../components/BottomTabBar";

const HomeScreen = ({ onLoginPress }) => (
  <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content}>
      <HomeHeader onLoginPress={onLoginPress} />
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
