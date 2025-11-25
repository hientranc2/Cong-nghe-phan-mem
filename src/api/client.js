const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return null;
};

export const fetchCollection = async (collection) => {
  const url = `${API_BASE}/${collection}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const fetchAllData = async () => {
  const [categories, menuItems, restaurants, orders] = await Promise.all([
    fetchCollection("categories"),
    fetchCollection("menuItems"),
    fetchCollection("restaurants"),
    fetchCollection("orders"),
  ]);

  return { categories, menuItems, restaurants, orders };
};

const postJSON = async (collection, payload) => {
  const url = `${API_BASE}/${collection}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const createMenuItem = async (item) => postJSON("menuItems", item);

export const createOrder = async (order) => postJSON("orders", order);

export const fetchOrders = async () => fetchCollection("orders");
