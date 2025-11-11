import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AuthForm from "../components/auth/AuthForm";
import { authContent } from "../data/auth";

const AuthScreen = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("login");

  const content = useMemo(() => authContent[activeTab], [activeTab]);

  const handleSubmit = (values) => {
    Alert.alert(content.successTitle, content.successMessage);
    console.log("Submitted values", activeTab, values);
  };

  const handleSwitchTab = (mode) => {
    if (mode !== activeTab) {
      setActiveTab(mode);
    }
  };

  const renderTabButton = (mode, label) => {
    const isActive = activeTab === mode;
    return (
      <TouchableOpacity
        key={mode}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={() => handleSwitchTab(mode)}
      >
        <Text
          style={[styles.tabButtonLabel, isActive && styles.tabButtonLabelActive]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.subtitle}>{content.subtitle}</Text>
      </View>

      <View style={styles.tabRow}>
        {renderTabButton("login", authContent.login.tabLabel)}
        {renderTabButton("register", authContent.register.tabLabel)}
      </View>

      <ScrollView contentContainerStyle={styles.formWrapper}>
        <AuthForm
          mode={activeTab}
          content={content}
          onSubmit={handleSubmit}
        />
        <TouchableOpacity
          style={styles.switchRow}
          onPress={() =>
            handleSwitchTab(activeTab === "login" ? "register" : "login")
          }
        >
          <Text style={styles.switchLabel}>{content.switchLabel}</Text>
          <Text style={styles.switchAction}>{content.switchAction}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backIcon: {
    fontSize: 18,
    color: "#f04e23",
    marginRight: 6,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f04e23",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1b1b1f",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#4a4a55",
    marginTop: 8,
    lineHeight: 22,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f7",
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: "#1b1b1f",
  },
  tabButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4a4a55",
  },
  tabButtonLabelActive: {
    color: "#ffffff",
  },
  formWrapper: {
    padding: 24,
    paddingBottom: 48,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchLabel: {
    fontSize: 14,
    color: "#4a4a55",
    marginRight: 6,
  },
  switchAction: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f04e23",
  },
});

export default AuthScreen;
