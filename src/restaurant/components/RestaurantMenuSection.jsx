function RestaurantMenuSection({
  texts,
  isFormVisible,
  editingDishId,
  dishForm,
  uniqueCategories,
  menuItems,
  onFieldChange,
  onSubmit,
  onCancel,
  onEditDish,
  onDeleteDish,
  formatCurrency,
  statusBadgeClass,
}) {
  return (
    <section className="restaurant-section">
      <header className="restaurant-section__header">
        <div>
          <h2>{texts.heading}</h2>
          <p>{texts.description}</p>
        </div>
      </header>

      {isFormVisible && (
        <form className="restaurant-card restaurant-form" onSubmit={onSubmit}>
          <div className="restaurant-form__header">
            <h3>{editingDishId ? texts.form.titleUpdate : texts.form.titleCreate}</h3>
          </div>
          <div className="restaurant-form__grid">
            <label>
              <span>{texts.form.name}</span>
              <input
                required
                type="text"
                value={dishForm.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.price}</span>
              <input
                required
                min="0"
                type="number"
                value={dishForm.price}
                onChange={(event) => onFieldChange("price", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.category}</span>
              <input
                type="text"
                placeholder={
                  uniqueCategories.length > 0 ? `VD: ${uniqueCategories[0]}` : "Burger"
                }
                value={dishForm.category}
                onChange={(event) => onFieldChange("category", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.status}</span>
              <select
                value={dishForm.status}
                onChange={(event) => onFieldChange("status", event.target.value)}
              >
                {texts.form.statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{texts.form.tag}</span>
              <input
                type="text"
                value={dishForm.tag}
                onChange={(event) => onFieldChange("tag", event.target.value)}
              />
            </label>
            <label className="restaurant-form__full">
              <span>{texts.form.description}</span>
              <textarea
                rows={3}
                value={dishForm.description}
                onChange={(event) => onFieldChange("description", event.target.value)}
              />
            </label>
          </div>
          <div className="restaurant-form__actions">
            <button
              type="button"
              className="restaurant-btn restaurant-btn--ghost"
              onClick={onCancel}
            >
              {texts.form.cancel}
            </button>
            <button type="submit" className="restaurant-btn">
              {editingDishId ? texts.form.submitUpdate : texts.form.submitCreate}
            </button>
          </div>
        </form>
      )}

      <div className="restaurant-card">
        {menuItems.length === 0 ? (
          <p className="restaurant-empty">{texts.empty}</p>
        ) : (
          <div className="restaurant-table" role="table">
            <div className="restaurant-table__header" role="row">
              <span role="columnheader">{texts.form.name}</span>
              <span role="columnheader">{texts.form.category}</span>
              <span role="columnheader">{texts.form.price}</span>
              <span role="columnheader">{texts.form.status}</span>
              <span role="columnheader">{texts.form.tag}</span>
              <span role="columnheader" className="table-actions">
                {texts.actionsLabel ?? "Hành động"}
              </span>
            </div>
            {menuItems.map((dish) => (
              <div key={dish.id} className="restaurant-table__row" role="row">
                <span role="cell">
                  <strong>{dish.name}</strong>
                  {dish.description && <small>{dish.description}</small>}
                </span>
                <span role="cell">{dish.category || "-"}</span>
                <span role="cell">{formatCurrency(dish.price)}</span>
                <span role="cell">
                  <span className={statusBadgeClass(dish.status)}>
                    {dish.status === "soldout" ? "Hết hàng" : "Đang bán"}
                  </span>
                </span>
                <span role="cell">{dish.tag || "-"}</span>
                <span role="cell" className="table-actions">
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => onEditDish?.(dish)}
                  >
                    {texts.actions.edit}
                  </button>
                  <button
                    type="button"
                    className="link-button link-button--danger"
                    onClick={() => onDeleteDish?.(dish)}
                  >
                    {texts.actions.delete}
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RestaurantMenuSection;
