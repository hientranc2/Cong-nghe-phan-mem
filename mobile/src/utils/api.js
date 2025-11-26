import { Platform } from "react-native";
import bundledData from "../../../db.json";

const getDefaultApiBase = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  }

  return "http://localhost:3001";
};

const API_BASE =
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env?.EXPO_PUBLIC_API_URL) ??
  getDefaultApiBase();

const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

const fetchFallbackDataset = async () => {
  const candidates = ["/dtb.json", "/db.json", "/db"];

  for (const path of candidates) {
    const response = await fetch(`${API_BASE}${path}`).catch(() => null);
    if (!response || !response.ok) {
      continue;
    }

    const data = await parseJSON(response);
    if (data) {
      return data;
    }
  }

  return null;
};

const getBundledDataset = () =>
  bundledData && typeof bundledData === "object" ? bundledData : null;

export const fetchCollection = async (collection) => {
  const primaryUrl = `${API_BASE}/${collection}`;
  const primaryResponse = await fetch(primaryUrl).catch(() => null);

  if (primaryResponse?.ok) {
    const parsed = await parseJSON(primaryResponse);
    if (parsed) {
      return parsed;
    }
  }

  const fallbackData = await fetchFallbackDataset();
  if (fallbackData && Array.isArray(fallbackData[collection])) {
    return fallbackData[collection];
  }

  const bundledDataset = getBundledDataset();
  if (bundledDataset && Array.isArray(bundledDataset[collection])) {
    return bundledDataset[collection];
  }

  throw new Error(
    `API request failed${primaryResponse ? `: ${primaryResponse.status}` : ""}`
  );
};
