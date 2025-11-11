import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HomeHeader from "../components/HomeHeader.jsx";
import BestSellerSection from "../components/BestSellerSection.jsx";
import FloatingCartButton from "../components/FloatingCartButton.jsx";
import BottomTabBar from "../components/BottomTabBar.jsx";
import MenuScreen from "./MenuScreen.jsx";

const HOME_TAB = "home";
const MENU_TAB = "menu";

const HomeScreen = ({ onPressLogin, user }) => {
  const [activeTab, setActiveTab] = useState(HOME_TAB);

  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId === MENU_TAB ? MENU_TAB : HOME_TAB);
  }, []);

  return (
    <View style={styles.screen}>
      {activeTab === MENU_TAB ? (
        <MenuScreen />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <HomeHeader onLoginPress={onPressLogin} user={user} />
          <BestSellerSection />
        </ScrollView>
      )}
      <FloatingCartButton />
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

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
