import "./DashboardPlaceholder.css";

function AdminDashboard({ user = null, texts = {}, onBackHome = () => {} }) {
  const title = texts.title ?? "Bảng điều khiển quản trị";
  const greeting = texts.greeting ?? `Xin chào ${user?.name ?? "Admin"}!`;
  const description =
    texts.description ??
    "Khu vực quản trị sẽ cho phép bạn quản lý đơn hàng, thực đơn và người dùng. Tính năng đang được phát triển.";
  const roadmapTitle = texts.roadmapTitle ?? "Các tính năng sắp ra mắt";
  const roadmapItems =
    texts.roadmapItems ?? [
      "📦 Theo dõi trạng thái đơn hàng theo thời gian thực",
      "🧾 Quản lý thực đơn, giá bán và chương trình khuyến mãi",
      "👥 Phân quyền nhân sự và quản lý đội ngũ giao nhận",
    ];
  const backLabel = texts.backLabel ?? "Về trang chủ";

  return (
    <main className="dashboard-placeholder" aria-labelledby="admin-dashboard-heading">
      <section className="dashboard-card">
        <h2 id="admin-dashboard-heading">{title}</h2>
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

export default AdminDashboard;
