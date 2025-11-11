import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { headerContent } from "../data/homepage";

const loginAction = headerContent.actions.find((action) => action.id === "login");

const HomeHeader = ({ onLoginPress = () => {}, user }) => {
  const displayName =
    typeof user?.fullName === "string" && user.fullName.trim().length > 0
      ? user.fullName.trim()
      : null;

  return (
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
        {displayName ? (
          <View style={styles.userChip}>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        ) : loginAction ? (
          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Text style={styles.loginIcon}>{loginAction.icon}</Text>
            <Text style={styles.loginLabel}>{loginAction.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#f97316",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#fb923c",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff7ed",
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#f97316",
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
    color: "#ffffff",
  },
  tagline: {
    fontSize: 14,
    color: "#fff7ed",
    marginTop: 4,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  loginIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#f97316",
  },
  loginLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  userChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    maxWidth: 180,
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7c2d12",
    flexShrink: 1,
  },
});

export default HomeHeader;
