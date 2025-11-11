function RestaurantOverview({
  overviewTexts,
  uniqueCategories,
  menuCount,
  orderCount,
  monthlyRevenue,
  processingOrders,
  todaysOrders,
  ratingValue,
  ratingInfo,
  recentOrders,
  formatCurrency,
  formatDateTime,
  statusBadgeClass,
}) {
  return (
    <section className="restaurant-section">
      <header className="restaurant-section__header">
        <div>
          <h2>{overviewTexts.heading}</h2>
          <p>{overviewTexts.description}</p>
        </div>
        <div className="restaurant-section__chips">
          <span>{uniqueCategories.length} danh mục</span>
          <span>{menuCount} món ăn</span>
          <span>{orderCount} đơn hàng/tháng</span>
        </div>
      </header>
      <div className="restaurant-kpi-grid">
        <div className="restaurant-kpi-card">
          <span>{overviewTexts.revenueLabel}</span>
          <strong>{formatCurrency(monthlyRevenue)}</strong>
          <small>{processingOrders} đơn đang hoạt động</small>
        </div>
        <div className="restaurant-kpi-card">
          <span>{overviewTexts.ordersTodayLabel}</span>
          <strong>{todaysOrders}</strong>
          <small>Trong ngày hôm nay</small>
        </div>
        <div className="restaurant-kpi-card">
          <span>{overviewTexts.ratingLabel}</span>
          <strong>{ratingValue}</strong>
          <small>{ratingInfo.summary}</small>
        </div>
      </div>
      <div className="restaurant-panels">
        <section className="restaurant-card">
          <header className="restaurant-card__header">
            <div>
              <h3>{overviewTexts.recentHeading}</h3>
              <p>Danh sách các đơn hàng mới nhất của nhà hàng.</p>
            </div>
          </header>
          {recentOrders.length === 0 ? (
            <p className="restaurant-empty">{overviewTexts.recentEmpty}</p>
          ) : (
            <ul className="restaurant-recent-list">
              {recentOrders.map((order) => (
                <li key={order.id} className="restaurant-recent-item">
                  <div className="recent-item__meta">
                    <span className="recent-item__id">{order.id}</span>
                    <strong>{order.customer}</strong>
                    <time dateTime={order.placedAt}>{formatDateTime(order.placedAt)}</time>
                  </div>
                  <div className="recent-item__status">
                    <span className={statusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                    <span className="recent-item__total">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="restaurant-card restaurant-card--feedback">
          <header className="restaurant-card__header">
            <div>
              <h3>{overviewTexts.reviewHeading}</h3>
              <p>
                Trung bình {ratingValue} dựa trên {ratingInfo.totalReviews} đánh giá.
              </p>
            </div>
          </header>
          <div className="restaurant-rating">
            <div className="restaurant-rating__value">{ratingValue}</div>
            <p>{ratingInfo.summary}</p>
            <ul className="restaurant-rating__breakdown">
              {ratingInfo.breakdown.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <div className="rating-progress">
                    <div
                      className="rating-progress__bar"
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    />
                  </div>
                  <span>{item.percent}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}

export default RestaurantOverview;
