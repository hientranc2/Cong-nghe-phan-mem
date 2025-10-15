import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";

function CategoryPage({ categories, menuItems, addToCart, onNavigateSection = () => {} }) {
  const { slug } = useParams();
  const category = categories.find((cat) => cat.slug === slug);

  const items = useMemo(() => {
    if (!category) {
      return [];
    }
    return menuItems.filter((item) => item.categoryId === category.id);
  }, [category, menuItems]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const handleBackToMenu = () => {
    onNavigateSection("menu");
  };

  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="breadcrumb">
          <button type="button" onClick={handleBackToMenu}>
            Trang chủ
          </button>
          <span>/</span>
          <span>{category.title}</span>
        </div>
        <div className="category-hero__content">
          <span className="category-hero__icon">{category.icon}</span>
          <h2>{category.heroTitle ?? category.title}</h2>
          <p>{category.heroDescription ?? category.description}</p>
          <div className="category-hero__actions">
            <button type="button" onClick={handleBackToMenu}>
              ← Trở lại danh mục
            </button>
          </div>
        </div>
      </section>

      <section className="category-results">
        <div className="section-heading">
          <h2>Danh sách món {category.title.toLowerCase()}</h2>
          <p>
            Thưởng thức những món {category.title.toLowerCase()} được đội ngũ FCO
            lựa chọn kỹ càng cho từng khẩu vị.
          </p>
        </div>

        {items.length > 0 ? (
          <Menu items={items} addToCart={addToCart} />
        ) : (
          <div className="category-empty">
            <p>Danh mục đang được cập nhật món ăn. Vui lòng quay lại sau.</p>
            <button type="button" onClick={handleBackToMenu}>
              Quay về danh mục chính
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoryPage;
