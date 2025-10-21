import "./DashboardPlaceholder.css";

function RestaurantDashboard({ user = null, texts = {}, onBackHome = () => {} }) {
  const title = texts.title ?? "Trung tâm đối tác nhà hàng";
  const greeting = texts.greeting ?? `Xin chào ${user?.name ?? "đối tác"}!`;
  const description =
    texts.description ??
    "Khu vực dành cho nhà hàng sẽ giúp bạn quản lý menu, cập nhật tình trạng món và theo dõi doanh thu. Chúng tôi sẽ bổ sung đầy đủ trong các phiên bản kế tiếp.";
  const roadmapTitle = texts.roadmapTitle ?? "Sắp có trong bản cập nhật tiếp theo";
  const roadmapItems =
    texts.roadmapItems ?? [
      "🍳 Cập nhật trạng thái món ăn theo thời gian thực",
      "📈 Báo cáo doanh thu và lượt đặt món",
      "🤝 Quản lý ca làm việc của nhân viên bếp",
    ];
  const backLabel = texts.backLabel ?? "Về trang chủ";

  return (
    <main className="dashboard-placeholder" aria-labelledby="restaurant-dashboard-heading">
      <section className="dashboard-card">
        <h2 id="restaurant-dashboard-heading">{title}</h2>
        <p className="dashboard-card__greeting">{greeting}</p>
        <p className="dashboard-card__description">{description}</p>
        <div className="dashboard-card__roadmap">
          <h3>{roadmapTitle}</h3>
          <ul>
            {roadmapItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <button type="button" className="dashboard-btn" onClick={onBackHome}>
          {backLabel}
        </button>
      </section>
    </main>
  );
}

export default RestaurantDashboard;
