import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const getKeyboardType = (field) => field.keyboardType ?? "default";

const AuthForm = ({
  formId,
  formConfig,
  values,
  errors,
  onChange,
  onSubmit,
  isSubmitting,
  status
}) => (
  <View style={styles.formCard}>
    {formConfig.fields.map((field) => (
      <View key={`${formId}-${field.id}`} style={styles.formField}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <TextInput
          value={values[field.id] ?? ""}
          onChangeText={(text) => onChange(formId, field.id, text)}
          placeholder={field.placeholder}
          placeholderTextColor="#d4d4d4"
          style={[
            styles.input,
            errors[field.id] ? styles.inputError : undefined
          ]}
          keyboardType={getKeyboardType(field)}
          secureTextEntry={Boolean(field.secureTextEntry)}
        />
        {errors[field.id] ? (
          <Text style={styles.errorText}>{errors[field.id]}</Text>
        ) : null}
      </View>
    ))}

    <TouchableOpacity
      style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
      onPress={() => onSubmit(formId)}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.primaryButtonLabel}>{formConfig.primaryAction}</Text>
      )}
    </TouchableOpacity>

    {formConfig.secondaryAction ? (
      <TouchableOpacity disabled={isSubmitting}>
        <Text style={styles.secondaryAction}>{formConfig.secondaryAction}</Text>
      </TouchableOpacity>
    ) : null}

    {formConfig.secondaryHint ? (
      <Text style={styles.secondaryHint}>{formConfig.secondaryHint}</Text>
    ) : null}

    {status?.message ? (
      <View
        style={[
          styles.statusContainer,
          status.type === "error" ? styles.statusError : styles.statusSuccess
        ]}
      >
        <Text
          style={[
            styles.statusText,
            status.type === "error"
              ? styles.statusTextError
              : styles.statusTextSuccess
          ]}
        >
          {status.message}
        </Text>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
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
    elevation: 3
  },
  formField: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7c2d12",
    marginBottom: 8
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fffaf5",
    color: "#1f2937"
  },
  inputError: {
    borderColor: "#f87171",
    backgroundColor: "#fef2f2"
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#b91c1c"
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  primaryButtonDisabled: {
    opacity: 0.7
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  secondaryAction: {
    marginTop: 16,
    textAlign: "center",
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600"
  },
  secondaryHint: {
    marginTop: 16,
    textAlign: "center",
    color: "#9a3412",
    fontSize: 12,
    lineHeight: 18
  },
  statusContainer: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12
  },
  statusError: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca"
  },
  statusSuccess: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#bbf7d0"
  },
  statusText: {
    fontSize: 13,
    textAlign: "center"
  },
  statusTextError: {
    color: "#b91c1c",
    fontWeight: "600"
  },
  statusTextSuccess: {
    color: "#047857",
    fontWeight: "600"
  }
});

export default AuthForm;
