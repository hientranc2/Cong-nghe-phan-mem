const API_BASE =
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env?.EXPO_PUBLIC_API_URL) ??
  "http://localhost:3001";

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
