import { useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "revenue-desc", label: "Doanh thu cao → thấp" },
  { value: "revenue-asc", label: "Doanh thu thấp → cao" },
  { value: "name-asc", label: "Tên A → Z" },
  { value: "name-desc", label: "Tên Z → A" },
];

const normalizeName = (value) => String(value ?? "").trim().toLowerCase();

function normalizeRestaurantKey(
  order = {},
  restaurantIndex = new Map(),
  nameIndex = new Map()
) {
  const directId = order.restaurantId || order.restaurantSlug;
  if (directId && restaurantIndex.has(directId)) return directId;

  if (order.restaurantSlug && restaurantIndex.has(order.restaurantSlug)) {
    return order.restaurantSlug;
  }

  const normalizedName = normalizeName(order.restaurantName);
  if (normalizedName && nameIndex.has(normalizedName)) {
    return nameIndex.get(normalizedName);
  }

  if (order.restaurantId && restaurantIndex.has(order.restaurantId)) {
    return order.restaurantId;
  }

  return null;
}
function RevenueByRestaurantChart({ restaurants, orders, formatCurrency }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("revenue-desc");

  const { restaurantIndex, restaurantNameIndex } = useMemo(() => {
  const map = new Map();
  const nameMap = new Map();
  restaurants.forEach((restaurant) => {
    if (restaurant.id) map.set(restaurant.id, restaurant);
    if (restaurant.slug) map.set(restaurant.slug, restaurant);
    if (restaurant.name) {
      nameMap.set(normalizeName(restaurant.name), restaurant.id);
    }
  });
  return { restaurantIndex: map, restaurantNameIndex: nameMap };
}, [restaurants]);

  const revenueStats = useMemo(() => {
    const totals = new Map();

    restaurants.forEach((restaurant) => {
      totals.set(restaurant.id, {
        key: restaurant.id,
        name: restaurant.name,
        city: restaurant.city || restaurant.address || "",
        revenue: 0,
        orders: 0,
      });
    });

    orders.forEach((order) => {
      const amount = Number(order.total || 0);
      if (!Number.isFinite(amount)) return;

      const key = normalizeRestaurantKey(order, restaurantIndex, restaurantNameIndex);
      if (!key) return;

      const matchedRestaurant = restaurantIndex.get(key) || null;

      const current = totals.get(key) || {
        key,
        name:
          matchedRestaurant?.name ||
          order.restaurantName ||
          order.restaurantSlug ||
          order.restaurantId ||
          "Không xác định",
        city:
          matchedRestaurant?.city ||
          matchedRestaurant?.address ||
          order.restaurantAddress ||
          "",
        revenue: 0,
        orders: 0,
      };

      totals.set(key, {
        ...current,
        revenue: current.revenue + amount,
        orders: current.orders + 1,
      });
    });

    return Array.from(totals.values());
  }, [orders, restaurants, restaurantIndex, restaurantNameIndex]);

  const filteredStats = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = revenueStats;

    if (term) {
      list = list.filter((item) =>
        [item.name, item.city, item.key]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "revenue-asc") return a.revenue - b.revenue;
      if (sortBy === "revenue-desc") return b.revenue - a.revenue;

      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";

      if (sortBy === "name-desc") return nameB.localeCompare(nameA);
      return nameA.localeCompare(nameB);
    });
  }, [query, revenueStats, sortBy]);

  const maxRevenue = useMemo(() => {
    return filteredStats.reduce((max, item) => Math.max(max, item.revenue), 0);
  }, [filteredStats]);

  return (
    <section className="revenue-card">
      <div className="revenue-card__header">
        <div>
          <p className="revenue-card__eyebrow">Thống kê</p>
          <h3>Doanh thu theo nhà hàng</h3>
          <p className="revenue-card__desc">
            Mỗi cột biểu diễn tổng doanh thu và số đơn hàng của từng nhà hàng.
          </p>
        </div>
        <div className="revenue-card__controls">
          <input
            type="search"
            placeholder="Tìm nhà hàng hoặc địa điểm..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStats.length === 0 ? (
        <div className="revenue-card__empty">Không có dữ liệu phù hợp.</div>
      ) : (
        <div className="revenue-chart" role="list">
          {filteredStats.map((item) => {
            const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={item.key} className="revenue-bar" role="listitem">
                <div className="revenue-bar__track" aria-hidden>
                  <div
                    className="revenue-bar__fill"
                    style={{ height: `${Math.max(12, height)}%` }}
                  >
                    <span className="revenue-bar__value">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
                <div className="revenue-bar__label">{item.name}</div>
                <div className="revenue-bar__meta">
                  {item.orders} đơn{item.city ? ` • ${item.city}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RevenueByRestaurantChart;
