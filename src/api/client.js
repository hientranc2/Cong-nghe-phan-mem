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
  const [categories, menuItems, restaurants, orders, users, drones] = await Promise.all([
    fetchCollection("categories"),
    fetchCollection("menuItems"),
    fetchCollection("restaurants"),
    fetchCollection("orders"),
    fetchCollection("users"),
    fetchCollection("drones"),
  ]);

  return { categories, menuItems, restaurants, orders, users, drones };
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

export const updateMenuItem = async (id, payload) => {
  const url = `${API_BASE}/menuItems/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const deleteMenuItem = async (id) => {
  const url = `${API_BASE}/menuItems/${id}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return true;
};

export const createOrder = async (order) => postJSON("orders", order);

export const fetchOrders = async () => fetchCollection("orders");

export const updateOrder = async (id, payload) => {
  const url = `${API_BASE}/orders/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const deleteOrder = async (id) => {
  const url = `${API_BASE}/orders/${id}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return true;
};

export const createRestaurant = async (payload) => postJSON("restaurants", payload);

export const updateRestaurant = async (id, payload) => {
  const url = `${API_BASE}/restaurants/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const deleteRestaurant = async (id) => {
  const url = `${API_BASE}/restaurants/${id}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return true;
};

export const fetchUsers = async () => fetchCollection("users");

export const createUser = async (payload) => postJSON("users", payload);

export const fetchDrones = async () => fetchCollection("drones");

export const createDrone = async (payload) => postJSON("drones", payload);

export const updateDrone = async (id, payload) => {
  const url = `${API_BASE}/drones/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return parseJSON(response);
};

export const deleteDrone = async (id) => {
  const url = `${API_BASE}/drones/${id}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return true;
};
