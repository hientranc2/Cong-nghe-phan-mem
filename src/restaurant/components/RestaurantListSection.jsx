function RestaurantListSection({
  texts,
  isFormVisible,
  editingRestaurantId,
  restaurantForm,
  restaurants,
  onFieldChange,
  onSubmit,
  onCancel,
  onEditRestaurant,
  onDeleteRestaurant,
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
            <h3>
              {editingRestaurantId
                ? texts.form.titleUpdate
                : texts.form.titleCreate}
            </h3>
          </div>
          <div className="restaurant-form__grid">
            <label>
              <span>{texts.form.name}</span>
              <input
                required
                type="text"
                value={restaurantForm.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.badge}</span>
              <input
                type="text"
                value={restaurantForm.badge}
                onChange={(event) => onFieldChange("badge", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.city}</span>
              <input
                type="text"
                value={restaurantForm.city}
                onChange={(event) => onFieldChange("city", event.target.value)}
              />
            </label>
            <label>
              <span>{texts.form.deliveryTime}</span>
              <input
                type="text"
                value={restaurantForm.deliveryTime}
                onChange={(event) =>
                  onFieldChange("deliveryTime", event.target.value)
                }
              />
            </label>
            <label className="restaurant-form__full">
              <span>{texts.form.description}</span>
              <textarea
                rows={3}
                value={restaurantForm.description}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
              />
            </label>
            <label className="restaurant-form__full">
              <span>{texts.form.tags}</span>
              <input
                type="text"
                placeholder="Ví dụ: Burger, Pizza"
                value={restaurantForm.tags}
                onChange={(event) => onFieldChange("tags", event.target.value)}
              />
            </label>
            <label className="restaurant-form__full">
              <span>{texts.form.image}</span>
              <input
                type="url"
                placeholder="https://..."
                value={restaurantForm.img}
                onChange={(event) => onFieldChange("img", event.target.value)}
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
              {editingRestaurantId
                ? texts.form.submitUpdate
                : texts.form.submitCreate}
            </button>
          </div>
        </form>
      )}

      <div className="restaurant-card">
        {restaurants.length === 0 ? (
          <p className="restaurant-empty">{texts.empty}</p>
        ) : (
          <div className="restaurant-table" role="table">
            <div className="restaurant-table__header" role="row">
              <span role="columnheader">{texts.form.name}</span>
              <span role="columnheader">{texts.form.city}</span>
              <span role="columnheader">{texts.form.deliveryTime}</span>
              <span role="columnheader">{texts.form.tags}</span>
              <span role="columnheader" className="table-actions">
                {texts.actionsLabel ?? "Hành động"}
              </span>
            </div>
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-table__row" role="row">
                <span role="cell">{restaurant.name}</span>
                <span role="cell">{restaurant.city || "-"}</span>
                <span role="cell">{restaurant.deliveryTime || "-"}</span>
                <span role="cell">{restaurant.tags?.join(", ") || "-"}</span>
                <span role="cell" className="table-actions">
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onEditRestaurant(restaurant)}
                  >
                    {texts.actions.edit}
                  </button>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onDeleteRestaurant(restaurant)}
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

export default RestaurantListSection;
