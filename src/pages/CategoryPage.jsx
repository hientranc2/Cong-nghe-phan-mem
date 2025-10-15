import Menu from "../components/Menu";

function CategoryPage({
  category,
  items,
  addToCart,
  onNavigateHome = () => {},
  onNavigateMenu = () => {},
  texts = {},
  menuLabels,
}) {
  const formatText = (template) =>
    (template ?? "")
      .replace("{category}", category.title)
      .replace("{categoryLower}", category.title.toLowerCase());

  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="breadcrumb">
          <button type="button" onClick={onNavigateHome}>
            {texts.breadcrumbHome}
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
              {texts.backToMenu}
            </button>
          </div>
        </div>
      </section>

      <section className="category-results">
        <div className="section-heading">
          <h2>{formatText(texts.listHeading)}</h2>
          <p>{formatText(texts.listDescription)}</p>
        </div>

        {items.length > 0 ? (
          <Menu items={items} addToCart={addToCart} labels={menuLabels} />
        ) : (
          <div className="category-empty">
            <p>{texts.emptyMessage}</p>
            <button type="button" onClick={onNavigateMenu}>
              {texts.emptyCta}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default CategoryPage;
