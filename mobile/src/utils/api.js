const API_BASE =
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env?.EXPO_PUBLIC_API_URL) ??
  "http://localhost:3001";

export const fetchCollection = async (collection) => {
  const response = await fetch(`${API_BASE}/${collection}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};
