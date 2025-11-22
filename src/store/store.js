import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { categories as defaultCategories, menuItems as defaultMenuItems } from "../data/menuData";

const MENU_STORAGE_KEY = "fcoMenu";
const ORDER_STORAGE_KEY = "fcoOrders";
const USER_STORAGE_KEY = "fcoUsers";

const DEFAULT_USERS = [
  {
    id: "admin",
    name: "Quản trị viên FCO",
    email: "admin@fco.vn",
    password: "admin123",
    role: "admin",
  },
  {
    id: "restaurant",
    name: "Nhà hàng FCO",
    email: "restaurant@fco.vn",
    password: "fco123",
    role: "restaurant",
  },
];

const DEFAULT_RESTAURANT_ORDERS = [
  {
    id: "DH-4521",
    customer: { name: "Mai Anh" },
    itemsCount: 3,
    total: 347000,
    status: "Đang giao",
    placedAt: "2024-05-28T10:30:00",
    address: "Sunrise Riverside, Quận 7",
    source: "restaurant",
  },
  {
    id: "DH-4522",
    customer: { name: "Tú Anh" },
    itemsCount: 2,
    total: 198000,
    status: "Chuẩn bị",
    placedAt: "2024-05-28T09:15:00",
    address: "Vinhomes Central Park",
    source: "restaurant",
  },
  {
    id: "DH-4523",
    customer: { name: "Minh Quân" },
    itemsCount: 4,
    total: 337000,
    status: "Chờ xác nhận",
    placedAt: "2024-05-27T19:05:00",
    address: "Empire City, Thủ Đức",
    source: "restaurant",
  },
  {
    id: "DH-4524",
    customer: { name: "Lan Anh" },
    itemsCount: 5,
    total: 472000,
    status: "Đã hoàn tất",
    placedAt: "2024-05-26T12:40:00",
    address: "ETown Cộng Hòa, Tân Bình",
    source: "restaurant",
  },
];

const DEFAULT_ADMIN_ORDERS = [
  {
    id: "od-4521",
    customer: { name: "Phan Nhật" },
    destination: "Sunrise Riverside, Q7",
    droneId: "dr-01",
    total: 350000,
    status: "Đang giao",
    source: "admin",
  },
  {
    id: "od-4522",
    customer: { name: "Lý Thanh" },
    destination: "Vinhomes Grand Park",
    droneId: "dr-03",
    total: 215000,
    status: "Đang chuẩn bị",
    source: "admin",
  },
  {
    id: "od-4523",
    customer: { name: "Đoàn Mai" },
    destination: "ETown, Tân Bình",
    droneId: "dr-02",
    total: 540000,
    status: "Tạm hoãn",
    source: "admin",
  },
];

const StoreContext = createContext();

const normalizeMenuItem = (item, index = 0) => ({
  id: item?.id || `dish-${index + 1}`,
  name: item?.name ?? "",
  price: Number(item?.price) || 0,
  category: item?.category ?? item?.categoryId ?? "",
  categoryId: item?.categoryId ?? item?.category ?? "",
  status: item?.status ?? item?.availability ?? "available",
  description: item?.description ?? "",
  tag: item?.tag ?? null,
  img: item?.img ?? item?.image ?? null,
  translations: item?.translations ?? {},
});

const normalizeOrder = (order, index = 0) => {
  const itemsArray = Array.isArray(order?.items) ? order.items : [];
  const itemsCount = Array.isArray(order?.items)
    ? order.items.length
    : Number(order?.itemsCount ?? order?.items) || 0;

  return {
    id: order?.id || `ORD-${Date.now()}-${index}`,
    customer:
      typeof order?.customer === "string"
        ? { name: order.customer }
        : order?.customer ?? { name: "Khách lẻ" },
    items: itemsArray,
    itemsCount,
    total: Number(order?.total) || 0,
    status: order?.status ?? "Chờ xác nhận",
    placedAt: order?.placedAt ?? order?.createdAt ?? new Date().toISOString(),
    createdAt: order?.createdAt ?? order?.placedAt ?? new Date().toISOString(),
    address: order?.address ?? "",
    destination: order?.destination ?? order?.address ?? "",
    droneId: order?.droneId ?? "",
    note: order?.note ?? "",
    ownerEmail: order?.ownerEmail ?? "",
    paymentMethod: order?.paymentMethod ?? "cash",
    source: order?.source ?? "customer",
  };
};

const loadFromStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || "null");
    return Array.isArray(fallback) ? (Array.isArray(stored) ? stored : fallback) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = () => {
  const menuFromStorage = loadFromStorage(
    MENU_STORAGE_KEY,
    defaultMenuItems.map(normalizeMenuItem)
  );

  const ordersFromStorage = loadFromStorage(ORDER_STORAGE_KEY, null);
  const usersFromStorage = loadFromStorage(USER_STORAGE_KEY, DEFAULT_USERS);

  const fallbackOrders = [...DEFAULT_RESTAURANT_ORDERS, ...DEFAULT_ADMIN_ORDERS].map(
    normalizeOrder
  );

  return {
    categories: defaultCategories,
    menuItems: (Array.isArray(menuFromStorage) ? menuFromStorage : defaultMenuItems).map(
      normalizeMenuItem
    ),
    orders: Array.isArray(ordersFromStorage)
      ? ordersFromStorage.map(normalizeOrder)
      : fallbackOrders,
    users: Array.isArray(usersFromStorage) ? usersFromStorage : DEFAULT_USERS,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MENU_ITEMS": {
      const nextMenu =
        typeof action.payload === "function"
          ? action.payload(state.menuItems)
          : action.payload;
      return { ...state, menuItems: nextMenu.map(normalizeMenuItem) };
    }
    case "ADD_MENU_ITEM": {
      const nextMenu = [...state.menuItems, normalizeMenuItem(action.payload, state.menuItems.length)];
      return { ...state, menuItems: nextMenu };
    }
    case "UPDATE_MENU_ITEM": {
      const nextMenu = state.menuItems.map((item) =>
        item.id === action.payload.id ? normalizeMenuItem({ ...item, ...action.payload.updates }) : item
      );
      return { ...state, menuItems: nextMenu };
    }
    case "REMOVE_MENU_ITEM": {
      return { ...state, menuItems: state.menuItems.filter((item) => item.id !== action.payload) };
    }
    case "SET_ORDERS": {
      const nextOrders =
        typeof action.payload === "function"
          ? action.payload(state.orders)
          : action.payload;
      return { ...state, orders: nextOrders.map(normalizeOrder) };
    }
    case "ADD_ORDER": {
      const nextOrder = normalizeOrder(action.payload, state.orders.length);
      return { ...state, orders: [nextOrder, ...state.orders] };
    }
    case "UPDATE_ORDER": {
      const nextOrders = state.orders.map((order) =>
        order.id === action.payload.id ? normalizeOrder({ ...order, ...action.payload.updates }) : order
      );
      return { ...state, orders: nextOrders };
    }
    case "UPDATE_ORDER_STATUS": {
      const nextOrders = state.orders.map((order) =>
        order.id === action.payload.id
          ? normalizeOrder({ ...order, status: action.payload.status })
          : order
      );
      return { ...state, orders: nextOrders };
    }
    case "SET_USERS": {
      const nextUsers =
        typeof action.payload === "function"
          ? action.payload(state.users)
          : action.payload;
      return { ...state, users: nextUsers };
    }
    default:
      return state;
  }
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(state.menuItems));
      window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(state.orders));
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.users));
    } catch {
      // ignore persistence errors
    }
  }, [state.menuItems, state.orders, state.users]);

  const value = useMemo(() => {
    const addMenuItem = (item) => {
      dispatch({ type: "ADD_MENU_ITEM", payload: item });
    };

    const updateMenuItem = (id, updates) => {
      dispatch({ type: "UPDATE_MENU_ITEM", payload: { id, updates } });
    };

    const removeMenuItem = (id) => {
      dispatch({ type: "REMOVE_MENU_ITEM", payload: id });
    };

    const setMenuItems = (updater) => {
      dispatch({ type: "SET_MENU_ITEMS", payload: updater });
    };

    const createOrder = (order) => {
      const normalized = normalizeOrder(order, state.orders.length);
      dispatch({ type: "ADD_ORDER", payload: normalized });
      return normalized;
    };

    const updateOrderStatus = (id, status) => {
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
    };

    const updateOrder = (id, updates) => {
      dispatch({ type: "UPDATE_ORDER", payload: { id, updates } });
    };

    const setOrders = (updater) => {
      dispatch({ type: "SET_ORDERS", payload: updater });
    };

    const setUsers = (updater) => {
      dispatch({ type: "SET_USERS", payload: updater });
    };

    return {
      ...state,
      addMenuItem,
      updateMenuItem,
      removeMenuItem,
      setMenuItems,
      createOrder,
      updateOrderStatus,
      updateOrder,
      setOrders,
      setUsers,
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const useMenu = () => {
  const { menuItems, categories } = useStore();
  return { menuItems, categories };
};

export const useOrders = () => {
  const { orders, createOrder, updateOrderStatus, updateOrder, setOrders } = useStore();
  return { orders, createOrder, updateOrderStatus, updateOrder, setOrders };
};

export const useUsers = () => {
  const { users, setUsers } = useStore();
  return { users, setUsers };
};
