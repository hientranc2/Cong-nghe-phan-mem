import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import AuthForm from "./components/AuthForm.jsx";
import { authContent } from "./data/authContent";
import { authService } from "./services/authService";

const buildInitialValues = (forms) => {
  const initialValues = {};
  Object.entries(forms).forEach(([formId, formConfig]) => {
    initialValues[formId] = formConfig.fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {});
  });
  return initialValues;
};

const AuthScreen = ({ onBack, onLoginSuccess = () => {} }) => {
  const initialValues = useMemo(() => buildInitialValues(authContent.forms), []);
  const [activeTab, setActiveTab] = useState(authContent.tabs[0]?.id ?? "login");
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeForm = useMemo(
    () => authContent.forms[activeTab] ?? authContent.forms.login,
    [activeTab]
  );

  const resetFormState = useCallback((formId) => {
    setFormErrors((prev) => ({ ...prev, [formId]: {} }));
    setFormStatus((prev) => ({ ...prev, [formId]: undefined }));
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    resetFormState(tabId);
  };

  const handleChange = useCallback((formId, fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [fieldId]: value
      }
    }));
  }, []);

  const validateForm = useCallback((formId) => {
    const fields = authContent.forms[formId]?.fields ?? [];
    const currentValues = formValues[formId] ?? {};
    const errors = {};

    fields.forEach((field) => {
      const value = currentValues[field.id]?.trim();
      if (!value) {
        errors[field.id] = "Trường này là bắt buộc.";
      }

      if (formId === "register" && field.id === "password" && value && value.length < 8) {
        errors[field.id] = "Mật khẩu phải có ít nhất 8 ký tự.";
      }
    });

    setFormErrors((prev) => ({ ...prev, [formId]: errors }));
    return errors;
  }, [formValues]);

  const handleSubmit = useCallback(
    async (formId) => {
      const errors = validateForm(formId);
      if (Object.keys(errors).length > 0) {
        setFormStatus((prev) => ({
          ...prev,
          [formId]: {
            type: "error",
            message: "Vui lòng kiểm tra lại thông tin."
          }
        }));
        return;
      }

    setIsSubmitting(true);
    setFormStatus((prev) => ({ ...prev, [formId]: undefined }));

    try {
      let result;
      if (formId === "login") {
        result = authService.login(formValues.login);
      } else {
        result = authService.register(formValues.register);
      }

      if (result.success) {
        setFormValues((prev) => ({
          ...prev,
          [formId]: { ...initialValues[formId] },
          ...(formId === "register"
            ? {
                login: {
                  ...prev.login,
                  phone: prev.register.phone ?? "",
                  password: ""
                }
              }
            : {})
        }));
      }

      setFormStatus((prev) => ({
        ...prev,
        [formId]: {
          type: result.success ? "success" : "error",
          message: result.message
        }
      }));

      if (result.success) {
        if (formId === "register") {
          setActiveTab("login");
          setFormErrors((prev) => ({ ...prev, login: {} }));
          setFormStatus((prev) => ({
            ...prev,
            login: {
              type: "success",
              message: "Đăng ký thành công! Vui lòng đăng nhập."
            }
          }));
        }

        if (formId === "login" && result.user) {
          Alert.alert("Đăng nhập thành công", result.message);
          onLoginSuccess(result.user);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  },
    [formValues, initialValues, onLoginSuccess, validateForm]
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
              onPress={() => handleTabChange(tab.id)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AuthForm
        formId={activeTab}
        formConfig={activeForm}
        values={formValues[activeTab] ?? {}}
        errors={formErrors[activeTab] ?? {}}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        status={formStatus[activeTab]}
      />

      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>{authContent.contactSupport.title}</Text>
        <Text style={styles.supportContent}>{authContent.contactSupport.content}</Text>
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
    backgroundColor: "#fff8f2"
  },
  headerRow: {
    marginBottom: 24
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#f97316"
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316"
  },
  hero: {
    marginBottom: 32
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f97316",
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#7c2d12"
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fde8d6",
    padding: 4,
    marginBottom: 24
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12
  },
  tabButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2
  },
  tabLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#a16207"
  },
  tabLabelActive: {
    color: "#f97316"
  },
  supportCard: {
    backgroundColor: "#fff1e6",
    borderRadius: 18,
    padding: 20
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 8
  },
  supportContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7c2d12"
  }
});

export default AuthScreen;
