import Menu from "../components/Menu";

function ProductDetailPage({
  item,
  category,
  addToCart,
  onNavigateHome = () => {},
  onNavigateCategory = () => {},
  onViewProduct = () => {},
  relatedItems = [],
  texts = {},
  menuLabels = {},
}) {
  if (!item) {
    return null;
  }

  const breadcrumbLabel = texts.breadcrumbLabel ?? "Đường dẫn";
  const breadcrumbHome = texts.breadcrumbHome ?? "Trang chủ";
  const backLabel = texts.backLabel ?? "← Quay lại thực đơn";
  const detailHeading = texts.detailHeading ?? "Chi tiết món";
  const providerLabel = texts.providerLabel ?? "Nhà hàng cung cấp";
  const providerFallback = texts.providerFallback ?? "FCO Kitchen";
  const categoryLabel = texts.categoryLabel ?? "Danh mục";
  const viewCategoryLabel = texts.viewCategory ?? "Xem danh mục";
  const addToCartLabel =
    texts.addToCart ?? menuLabels.addToCart ?? "Thêm vào giỏ hàng";
  const caloriesLabel = texts.caloriesLabel ?? "Năng lượng";
  const timeLabel = texts.timeLabel ?? "Thời gian chuẩn bị";
  const prepTimeSuffix = menuLabels.prepTimeSuffix ?? "phút chuẩn bị";
  const suggestionHeading = texts.suggestionHeading ?? "Món gợi ý khác";
  const suggestionDescription =
    texts.suggestionDescription ?? "Thêm các lựa chọn khác mà bạn sẽ thích.";

  const handleCategoryClick = () => {
    if (category?.slug) {
      onNavigateCategory(category.slug);
    }
  };

  const providerText = item.restaurantName
    ? `${item.restaurantName}${item.restaurantCity ? ` · ${item.restaurantCity}` : ""}`
    : providerFallback;

  return (
    <main className="product-page">
      <nav className="product-breadcrumb" aria-label={breadcrumbLabel}>
        <button type="button" onClick={onNavigateHome}>
          {breadcrumbHome}
        </button>
        {category?.title && (
          <>
            <span>/</span>
            <button type="button" onClick={handleCategoryClick}>
              {category.title}
            </button>
          </>
        )}
        <span>/</span>
        <span aria-current="page">{item.name}</span>
      </nav>

      <section className="product-hero">
        <div className="product-hero__media">
          <img src={item.img} alt={item.name} />
          {item.tag && <span className="menu-card__tag">{item.tag}</span>}
        </div>
        <div className="product-hero__content">
          <button type="button" className="product-back" onClick={onNavigateHome}>
            {backLabel}
          </button>
          <span className="product-eyebrow">{detailHeading}</span>
          <h1>{item.name}</h1>
          <div className="product-price">{item.price}k</div>
          <p className="product-description">{item.description}</p>
          <div className="product-provider">
            <span>{providerLabel}</span>
            <strong>{providerText}</strong>
          </div>
          <div className="product-actions">
            <button
              type="button"
              className="product-actions__primary"
              onClick={() => addToCart(item)}
            >
              {addToCartLabel}
            </button>
          </div>
        </div>
      </section>

      {relatedItems.length > 0 && (
        <section className="product-related">
          <div className="section-heading">
            <h2>{suggestionHeading}</h2>
            <p>{suggestionDescription}</p>
          </div>
          <Menu
            items={relatedItems}
            addToCart={addToCart}
            labels={menuLabels}
            onViewItem={onViewProduct}
          />
        </section>
      )}
    </main>
  );
}

export default ProductDetailPage;
