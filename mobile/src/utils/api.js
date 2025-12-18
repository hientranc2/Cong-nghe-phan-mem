import { Platform } from "react-native";
import Constants from "expo-constants";
import fallbackDb from "../data/db.json";


const resolveApiBase = () => {
  const envBaseUrl =
    typeof globalThis !== "undefined" &&
    globalThis.process &&
    (globalThis.process.env?.EXPO_PUBLIC_API_URL ||
      globalThis.process.env?.API_URL ||
      globalThis.process.env?.VITE_API_URL);

  if (envBaseUrl) {
    return envBaseUrl;
  }

  const hostUri =
    Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost || "";
  const host = hostUri.split(":")?.[0];

  if (host) {
    return `http://${host}:4000`;
  }

  const extraApiUrl = Constants?.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) {
    return extraApiUrl;
  }

  if (Platform.OS === "android") {
    console.warn(
      "API base URL fallback to Android emulator loopback (10.0.2.2:4000). Set EXPO_PUBLIC_API_URL or expo.extra.apiUrl for physical devices."
    );
    return "http://10.0.2.2:4000";
  }

  console.warn(
    "API base URL fallback to localhost:4000. Set EXPO_PUBLIC_API_URL or expo.extra.apiUrl in app.json for real devices."
  );
  return "http://localhost:4000";
};

const API_BASE = resolveApiBase();

const FALLBACK_COLLECTIONS = {
  categories: fallbackDb.categories ?? [],
  menuItems: fallbackDb.menuItems ?? [],
  restaurants: fallbackDb.restaurants ?? [],
  users: fallbackDb.users ?? [],
  orders: fallbackDb.orders ?? [],
  drones: fallbackDb.drones ?? [],
};

const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
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

  if (Object.prototype.hasOwnProperty.call(FALLBACK_COLLECTIONS, collection)) {
    console.warn(
      `API request failed for ${collection}, using bundled fallback data instead.`
    );
    return FALLBACK_COLLECTIONS[collection];
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

export const createRestaurant = async (payload) =>
  postJSON("restaurants", payload);

export const updateRestaurant = async (id, payload) =>
  patchJSON("restaurants", id, payload);

export const deleteRestaurant = async (id) => deleteJSON("restaurants", id);

export const createUser = async (payload) => postJSON("users", payload);

export const updateUser = async (id, payload) => patchJSON("users", id, payload);

export const deleteUser = async (id) => deleteJSON("users", id);

export const fetchDrones = async () => fetchCollection("drones");

export const createDrone = async (payload) => postJSON("drones", payload);

export const updateDrone = async (id, payload) => patchJSON("drones", id, payload);

export const deleteDrone = async (id) => deleteJSON("drones", id);
