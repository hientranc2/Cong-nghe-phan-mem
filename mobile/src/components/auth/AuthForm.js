import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const createInitialValues = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});

const AuthForm = ({ mode, content, onSubmit }) => {
  const initialValues = useMemo(() => createInitialValues(content.fields), [content]);
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, mode]);

  const handleChange = (fieldId, fieldValue) => {
    setValues((prev) => ({ ...prev, [fieldId]: fieldValue }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <View style={styles.container}>
      {content.fields.map((field) => (
        <View key={field.id} style={styles.fieldWrapper}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor="#9c9ca4"
            value={values[field.id]}
            onChangeText={(value) => handleChange(field.id, value)}
            keyboardType={field.keyboardType || "default"}
            secureTextEntry={field.secureTextEntry}
            autoCapitalize={field.autoCapitalize || "none"}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitLabel}>{content.primaryAction}</Text>
      </TouchableOpacity>
      <Text style={styles.policyText}>{content.policyText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b1b1f",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8d9dd",
    paddingHorizontal: 16,
    backgroundColor: "#fdfdfd",
    fontSize: 15,
    color: "#1b1b1f",
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#f04e23",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  policyText: {
    fontSize: 12,
    color: "#7a7a85",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 16,
  },
});

export default AuthForm;
