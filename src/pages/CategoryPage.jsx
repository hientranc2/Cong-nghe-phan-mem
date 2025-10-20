import { useEffect, useMemo, useState } from "react";
import Menu from "../components/Menu";

const ITEMS_PER_PAGE = 3;

function CategoryPage({
  category,
  items = [],
  addToCart,
  onNavigateHome = () => {},
  onNavigateMenu = () => {},
  texts = {},
  menuLabels = {},
  onViewProduct = () => {},
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [category?.id, items.length]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE)),
    [items.length]
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, items]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
          <>
            <Menu
              items={paginatedItems}
              addToCart={addToCart}
              labels={menuLabels}
              onViewItem={onViewProduct}
            />
            {totalPages > 1 && (
              <div className="category-pagination" role="navigation" aria-label="Phân trang sản phẩm">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      className={`category-pagination__button ${isActive ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </>
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
