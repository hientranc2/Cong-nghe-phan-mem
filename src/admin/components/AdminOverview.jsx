import RevenueByRestaurantChart from "./RevenueByRestaurantChart";

function AdminOverview({
  metrics,
  overviewSummary,
  totalRevenue,
  formatCurrency,
  formatDate,
  restaurants,
  orders,
}) {
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
      <RevenueByRestaurantChart
        restaurants={restaurants}
        orders={orders}
        formatCurrency={formatCurrency}
      />
    </>
  );
}

export default AdminOverview;
