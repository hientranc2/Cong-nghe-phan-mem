import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { headerContent } from "../data/homepage";

const loginAction = headerContent.actions.find((action) => action.id === "login");

const HomeHeader = () => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{headerContent.topMessage}</Text>
    </View>
    <View style={styles.brandRow}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logoText}>FCO</Text>
      </View>
      <View style={styles.brandCopy}>
        <Text style={styles.brandName}>{headerContent.brandName}</Text>
        <Text style={styles.tagline}>{headerContent.tagline}</Text>
      </View>
      {loginAction ? (
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginIcon}>{loginAction.icon}</Text>
          <Text style={styles.loginLabel}>{loginAction.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ffe3d4",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f04e23",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  logoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1b1b1f",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  brandCopy: {
    flex: 1,
    marginHorizontal: 16,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  tagline: {
    fontSize: 14,
    color: "#4a4a55",
    marginTop: 4,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1b1b1f",
  },
  loginIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#ffffff",
  },
  loginLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default HomeHeader;
