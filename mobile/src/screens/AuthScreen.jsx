import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { authContent } from "../data/auth";

const AuthScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(authContent.tabs[0]?.id ?? "login");

  const activeForm = useMemo(
    () => authContent.forms[activeTab] ?? authContent.forms.login,
    [activeTab]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heading}>{authContent.heading}</Text>
        <Text style={styles.description}>{authContent.description}</Text>
      </View>

      <View style={styles.tabRow}>
        {authContent.tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.formCard}>
        {activeForm.fields.map((field) => (
          <View key={field.id} style={styles.formField}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              placeholder={field.placeholder}
              placeholderTextColor="#d4d4d4"
              style={styles.input}
              keyboardType={field.keyboardType}
              secureTextEntry={field.secureTextEntry}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{activeForm.primaryAction}</Text>
        </TouchableOpacity>

        {activeForm.secondaryAction ? (
          <TouchableOpacity>
            <Text style={styles.secondaryAction}>{activeForm.secondaryAction}</Text>
          </TouchableOpacity>
        ) : null}

        {activeForm.secondaryHint ? (
          <Text style={styles.secondaryHint}>{activeForm.secondaryHint}</Text>
        ) : null}
      </View>

      <View style={styles.socialSection}>
        <Text style={styles.socialTitle}>Hoặc tiếp tục với</Text>
        {authContent.socialProviders.map((provider) => (
          <TouchableOpacity key={provider.id} style={styles.socialButton}>
            <Text style={styles.socialIcon}>{provider.icon}</Text>
            <Text style={styles.socialLabel}>{provider.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>{authContent.contactSupport.title}</Text>
        <Text style={styles.supportContent}>
          {authContent.contactSupport.content}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 24,
    backgroundColor: "#fff8f2",
  },
  headerRow: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#f97316",
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  hero: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f97316",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#7c2d12",
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fde8d6",
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  tabLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#a16207",
  },
  tabLabelActive: {
    color: "#f97316",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    marginBottom: 32,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7c2d12",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fffaf5",
    color: "#1f2937",
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    marginTop: 16,
    textAlign: "center",
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryHint: {
    marginTop: 16,
    textAlign: "center",
    color: "#9a3412",
    fontSize: 12,
    lineHeight: 18,
  },
  socialSection: {
    marginBottom: 32,
  },
  socialTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#9a3412",
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  socialIcon: {
    marginRight: 10,
    fontSize: 18,
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c2d12",
  },
  supportCard: {
    backgroundColor: "#fff1e6",
    borderRadius: 18,
    padding: 20,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 8,
  },
  supportContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7c2d12",
  },
});

export default AuthScreen;
