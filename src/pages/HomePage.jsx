import Menu from "../components/Menu";

function HomePage({
  heroBackground,
  stats,
  categories,
  bestSellers: bestSellerItems,
  combos,
  promotions,
  addToCart,
  onSelectCategory = () => {},
  texts = {},
  menuLabels,
}) {
  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>{texts.heroTitle}</h2>
          <p>{texts.heroDescription}</p>
          <div className="hero-actions">
            <a href="#best-seller" className="btn-primary">
              {texts.heroPrimaryCta}
            </a>
            <a href="#combo" className="btn-secondary">
              {texts.heroSecondaryCta}
            </a>
          </div>
          <div className="hero-extra">
            {(texts.heroHighlights ?? []).map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="category" id="menu">
        <div className="section-heading">
          <h2>{texts.categoryHeading}</h2>
          <p>{texts.categoryDescription}</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id} className="category-card">
              <span className="category-icon">{category.icon}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <a
                href={`#/category/${category.slug}`}
                onClick={(event) => {
                  event.preventDefault();
                  onSelectCategory(category.slug);
                }}
              >
                {texts.categoryCta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="best-seller" id="best-seller">
        <div className="section-heading">
          <h2>{texts.bestSellerHeading}</h2>
          <p>{texts.bestSellerDescription}</p>
        </div>
        <Menu
          items={bestSellerItems}
          addToCart={addToCart}
          labels={menuLabels}
        />
      </section>

      <section className="combo" id="combo">
        <div className="section-heading">
          <h2>{texts.comboHeading}</h2>
          <p>{texts.comboDescription}</p>
        </div>
        <div className="combo-grid">
          {combos.map((combo) => (
            <article key={combo.name} className="combo-card">
              <div className="combo-badge">{combo.badge}</div>
              <h3>{combo.name}</h3>
              <p>{combo.desc}</p>
              <div className="combo-footer">
                <span>{combo.price}k</span>
                <button type="button">{texts.comboButton}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promotion" id="promo">
        <div className="section-heading">
          <h2>{texts.promotionHeading}</h2>
          <p>{texts.promotionDescription}</p>
        </div>
        <div className="promotion-grid">
          {promotions.map((promo) => (
            <article key={promo.title} className="promotion-card">
              <h3>{promo.title}</h3>
              <p>{promo.content}</p>
              <a href="#">{texts.promotionCta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <h2>{texts.aboutHeading}</h2>
          <p>{texts.aboutDescription}</p>
          <ul>
            {(texts.aboutList ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="about-visual">
          <img
            src="https://images.unsplash.com/photo-1555992336-cbf3a2862171?auto=format&fit=crop&w=900&q=80"
            alt="FCO Kitchen"
            loading="lazy"
          />
          <div className="about-badge">
            <strong>{texts.aboutBadgeValue}</strong>
            <span>{texts.aboutBadgeLabel}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
