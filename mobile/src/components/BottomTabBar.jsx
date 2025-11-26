import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const tabs = [
  { id: "home", label: "Trang chủ", icon: "🏠" },
  { id: "menu", label: "Thực đơn", icon: "🍽️" },
  { id: "restaurants", label: "Nhà hàng", icon: "🏬" },
  { id: "orders", label: "Đơn hàng", icon: "🧾" },
  { id: "more", label: "Xem thêm", icon: "☰" },
];

const BottomTabBar = ({ activeTab = "home", onTabPress = () => {} }) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabItem}
          onPress={() => onTabPress(tab.id)}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
        >
          <Text style={[styles.icon, isActive && styles.iconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
  tabItem: {
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    color: "#8e8e9a",
  },
  iconActive: {
    color: "#f04e23",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#8e8e9a",
    fontWeight: "600",
  },
  labelActive: {
    color: "#f04e23",
  },
});

export default BottomTabBar;
