import { Platform } from "react-native";
import Constants from "expo-constants";

import localDataset from "../data/db.json";

const resolveApiBase = () => {
  const envBaseUrl =
    typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env?.EXPO_PUBLIC_API_URL;

  if (envBaseUrl) {
    return envBaseUrl;
  }

  const hostUri =
    Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost || "";
  const host = hostUri.split(":")?.[0];

  if (host) {
    return `http://${host}:3001`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  }

  return "http://localhost:3001";
};

const API_BASE = resolveApiBase();

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

  if (localDataset && typeof localDataset === "object") {
    return localDataset;
  }

  return null;
};

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

  throw new Error(
    `API request failed${primaryResponse ? `: ${primaryResponse.status}` : ""}`
  );
};

const postJSON = async (collection, payload) => {
  const url = `${API_BASE}/${collection}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!response || !response.ok) {
    throw new Error(
      `API request failed${response ? `: ${response.status}` : ""}`
    );
  }

  return parseJSON(response);
};

export const createRecord = async (collection, payload) =>
  postJSON(collection, payload);

export const createOrder = async (order) => postJSON("orders", order);

const patchJSON = async (collection, id, payload) => {
  const url = `${API_BASE}/${collection}/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!response || !response.ok) {
    throw new Error(
      `API request failed${response ? `: ${response.status}` : ""}`
    );
  }

  return parseJSON(response);
};

const deleteJSON = async (collection, id) => {
  const url = `${API_BASE}/${collection}/${id}`;
  const response = await fetch(url, { method: "DELETE" }).catch(() => null);

  if (!response || !response.ok) {
    throw new Error(
      `API request failed${response ? `: ${response.status}` : ""}`
    );
  }

  return true;
};

export const updateOrder = async (id, payload) => patchJSON("orders", id, payload);

export const deleteOrder = async (id) => deleteJSON("orders", id);

export const createMenuItem = async (payload) => postJSON("menuItems", payload);

export const updateMenuItem = async (id, payload) =>
  patchJSON("menuItems", id, payload);

export const deleteMenuItem = async (id) => deleteJSON("menuItems", id);
