const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const buildUrl = (path = "") => `${API_BASE}/${path}`.replace(/\/+$/, "");

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    const message = data?.message ?? `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
};

const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};

export const fetchCollection = async (collection) => request(collection);

export const fetchAllData = async () => {
  const [categories, menuItems, restaurants] = await Promise.all([
    fetchCollection("categories"),
    fetchCollection("menuItems"),
    fetchCollection("restaurants"),
  ]);

  return { categories, menuItems, restaurants };
};

export const createDocument = async (collection, payload) =>
  request(collection, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateDocument = async (collection, id, payload) =>
  request(`${collection}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteDocument = async (collection, id) =>
  request(`${collection}/${id}`, { method: "DELETE" });

export const createOrder = async (order) => createDocument("orders", order);

export const createMenuItem = async (menuItem) =>
  createDocument("menuItems", menuItem);
