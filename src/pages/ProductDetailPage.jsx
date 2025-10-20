function ProductDetailPage({
  item,
  category,
  addToCart,
  onNavigateHome = () => {},
  onNavigateCategory = () => {},
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
  const descriptionHeading = texts.descriptionHeading ?? "Mô tả";
  const metaHeading = texts.metaHeading ?? "Thông tin món";
  const priceLabel = texts.priceLabel ?? "Giá";
  const caloriesLabel = texts.caloriesLabel ?? "Năng lượng";
  const timeLabel = texts.timeLabel ?? "Thời gian chuẩn bị";
  const categoryLabel = texts.categoryLabel ?? "Danh mục";
  const viewCategoryLabel = texts.viewCategory ?? "Xem danh mục";
  const addToCartLabel =
    texts.addToCart ?? menuLabels.addToCart ?? "Thêm vào giỏ hàng";
  const caloriesUnit = menuLabels.caloriesUnit ?? "kcal";
  const prepTimeSuffix = menuLabels.prepTimeSuffix ?? "phút chế biến";

  const handleCategoryClick = () => {
    if (category?.slug) {
      onNavigateCategory(category.slug);
    }
  };

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
          <div className="product-actions">
            <button
              type="button"
              className="product-actions__primary"
              onClick={() => addToCart(item)}
            >
              {addToCartLabel}
            </button>
            {category?.slug && (
              <button
                type="button"
                className="product-actions__secondary"
                onClick={handleCategoryClick}
              >
                {viewCategoryLabel}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="product-details">
        <div className="product-details__column">
          <h2>{descriptionHeading}</h2>
          <p>{item.description}</p>
        </div>
        <div className="product-details__column">
          <h2>{metaHeading}</h2>
          <ul className="product-meta">
            <li className="product-meta__item">
              <span className="product-meta__label">{priceLabel}</span>
              <span className="product-meta__value">{item.price}k</span>
            </li>
            <li className="product-meta__item">
              <span className="product-meta__label">{caloriesLabel}</span>
              <span className="product-meta__value">
                {item.calories} {caloriesUnit}
              </span>
            </li>
            <li className="product-meta__item">
              <span className="product-meta__label">{timeLabel}</span>
              <span className="product-meta__value">
                {item.time} {prepTimeSuffix}
              </span>
            </li>
            {category?.title && (
              <li className="product-meta__item">
                <span className="product-meta__label">{categoryLabel}</span>
                <span className="product-meta__value">{category.title}</span>
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;
