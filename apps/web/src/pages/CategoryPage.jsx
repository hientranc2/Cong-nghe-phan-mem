import Menu from "../components/Menu";

function CategoryPage({
  category,
  items = [],
  addToCart,
  onNavigateHome = () => {},
  onNavigateMenu = () => {},
  texts = {},
  menuLabels = {},
}) {
  const breadcrumbHome = texts.breadcrumbHome ?? "Trang chủ";
  const backToMenu = texts.backToMenu ?? "← Trở lại danh mục";
  const listHeadingTemplate = texts.listHeading ?? "Danh sách món {category}";
  const listDescriptionTemplate =
    texts.listDescription ??
    "Thưởng thức những món {categoryLower} được đội ngũ FCO lựa chọn kỹ càng cho từng khẩu vị.";
  const emptyMessage =
    texts.emptyMessage ?? "Danh mục đang được cập nhật món ăn. Vui lòng quay lại sau.";
  const emptyCta = texts.emptyCta ?? "Quay về danh mục chính";

  const categoryTitle = category.title ?? "";
  const categoryLower = categoryTitle.toLowerCase();
  const listHeading = listHeadingTemplate
    .replace("{category}", categoryTitle)
    .replace("{categoryLower}", categoryLower);
  const listDescription = listDescriptionTemplate
    .replace("{category}", categoryTitle)
    .replace("{categoryLower}", categoryLower);
  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="breadcrumb">
          <button type="button" onClick={onNavigateHome}>
            {breadcrumbHome}
          </button>
          <span>/</span>
          <span>{category.title}</span>
        </div>
        <div className="category-hero__content">
          <span className="category-hero__icon">{category.icon}</span>
          <h2>{category.heroTitle ?? category.title}</h2>
          <p>{category.heroDescription ?? category.description}</p>
          <div className="category-hero__actions">
            <button type="button" onClick={onNavigateMenu}>
              {backToMenu}
            </button>
          </div>
        </div>
      </section>

      <section className="category-results">
        <div className="section-heading">
          <h2>{listHeading}</h2>
          <p>{listDescription}</p>
        </div>

        {items.length > 0 ? (
          <Menu items={items} addToCart={addToCart} labels={menuLabels} />
        ) : (
          <div className="category-empty">
            <p>{emptyMessage}</p>
            <button type="button" onClick={onNavigateMenu}>
              {emptyCta}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoryPage;
