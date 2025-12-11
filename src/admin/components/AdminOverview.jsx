function AdminOverview({
  metrics,
  overviewSummary,
  totalRevenue,
  restaurantRevenue,
  formatCurrency,
  formatDate,
}) {
  const maxRevenue = restaurantRevenue?.length
    ? Math.max(...restaurantRevenue.map((entry) => entry.revenue))
    : 0;

  return (
    <>
      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.id} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
          </article>
        ))}
      </section>
      <section className="insights-grid">
        <article className="insight-card">
          <h3>Khách hàng mới nhất</h3>
          {overviewSummary.newestCustomer ? (
            <>
              <p className="insight-primary">
                {overviewSummary.newestCustomer.name}
              </p>
              <p className="insight-secondary">
                Gia nhập ngày {formatDate(overviewSummary.newestCustomer.joinedAt)}
              </p>
            </>
          ) : (
            <p className="insight-empty">Chưa có khách hàng.</p>
          )}
        </article>
        <article className="insight-card">
          <h3>Khách hàng hạng cao nhất</h3>
          {overviewSummary.topTierCustomer ? (
            <>
              <p className="insight-primary">
                {overviewSummary.topTierCustomer.name}
              </p>
              <p className="insight-secondary">
                Hạng {overviewSummary.topTierCustomer.tier}
              </p>
            </>
          ) : (
            <p className="insight-empty">Chưa có dữ liệu hạng.</p>
          )}
        </article>
        <article className="insight-card">
          <h3>Đơn hàng giá trị cao nhất</h3>
          {overviewSummary.largestOrder ? (
            <>
              <p className="insight-primary">{overviewSummary.largestOrder.id}</p>
              <p className="insight-secondary">
                Giá trị {formatCurrency(overviewSummary.largestOrder.total)}
              </p>
            </>
          ) : (
            <p className="insight-empty">Chưa có đơn hàng.</p>
          )}
        </article>
        <article className="insight-card">
          <h3>Tổng doanh thu hôm nay</h3>
          <p className="insight-primary">{formatCurrency(totalRevenue)}</p>
          <p className="insight-secondary">Từ tất cả các đơn hàng đang xử lý.</p>
        </article>
      </section>
      <section className="revenue-card">
        <div className="revenue-card__header">
          <div>
            <p className="revenue-card__eyebrow">Hiệu suất nhà hàng</p>
            <h3>Doanh thu theo nhà hàng</h3>
          </div>
          <p className="revenue-card__hint">
            Dữ liệu được tổng hợp từ số đơn và giá trị đơn hàng thực tế.
          </p>
        </div>
        {restaurantRevenue?.length ? (
          <div className="revenue-chart" role="list">
            {restaurantRevenue.map((restaurant) => {
              const percent = maxRevenue
                ? Math.round((restaurant.revenue / maxRevenue) * 100)
                : 0;
              return (
                <div
                  key={restaurant.id || restaurant.slug || restaurant.name}
                  className="revenue-bar"
                  role="listitem"
                  aria-label={`${restaurant.name}: ${restaurant.orderCount} đơn, doanh thu ${formatCurrency(
                    restaurant.revenue
                  )}`}
                >
                  <div className="revenue-bar__label">
                    <span className="revenue-bar__name">{restaurant.name}</span>
                    <span className="revenue-bar__orders">{restaurant.orderCount} đơn</span>
                  </div>
                  <div className="revenue-bar__track" aria-hidden="true">
                    <div
                      className="revenue-bar__fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="revenue-bar__value">
                    {formatCurrency(restaurant.revenue)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="insight-empty">Chưa có dữ liệu doanh thu.</p>
        )}
      </section>
    </>
  );
}

export default AdminOverview;
