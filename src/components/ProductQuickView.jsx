import { useEffect, useMemo, useState } from "react";

function ProductQuickView({ item, onClose, onAddToCart, labels = {} }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item?.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const basePrice = useMemo(() => {
    const priceNumber = Number.parseFloat(item?.price);
    return Number.isNaN(priceNumber) ? 0 : priceNumber;
  }, [item]);

  if (!item) {
    return null;
  }

  const addToCartLabel = labels.addToCart ?? "Thêm vào giỏ hàng";
  const quantityLabel = labels.quantity ?? "Số lượng";
  const totalLabel = labels.total ?? "Tổng";
  const closeLabel = labels.close ?? "Đóng";
  const caloriesUnit = labels.caloriesUnit ?? "kcal";
  const prepTimeSuffix = labels.prepTimeSuffix ?? "phút chế biến";
  const priceSuffix = labels.priceSuffix ?? "k";

  const hasCalories =
    typeof item.calories === "number" && Number.isFinite(item.calories);
  const hasPrepTime =
    typeof item.time === "number" && Number.isFinite(item.time);

  const handleQuantityChange = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(parsed, 99));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleSubmit = () => {
    onAddToCart?.(quantity);
  };

  const totalPrice = basePrice * quantity;

  const formatPriceValue = (value) => {
    if (!Number.isFinite(value)) {
      return `0${priceSuffix}`;
    }

    return `${value.toLocaleString("vi-VN")}${priceSuffix}`;
  };

  const formattedPrice = formatPriceValue(basePrice);
  const formattedTotal = formatPriceValue(totalPrice);

  const titleId = `product-modal-title-${item.id ?? "detail"}`;

  return (
    <div
      className="product-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="product-modal__backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="product-modal__container">
        <div className="product-modal__content">
          <button
            type="button"
            className="product-modal__close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ×
          </button>
          <div className="product-modal__media">
            <img src={item.img} alt={item.name} />
          </div>
          <div className="product-modal__body">
            <h2 id={titleId} className="product-modal__title">
              {item.name}
            </h2>
            <p className="product-modal__description">{item.description}</p>
            {(hasCalories || hasPrepTime) && (
              <div className="product-modal__meta">
                {hasCalories && (
                  <span>
                    🔥 {item.calories} {caloriesUnit}
                  </span>
                )}
                {hasPrepTime && (
                  <span>
                    ⏱ {item.time} {prepTimeSuffix}
                  </span>
                )}
              </div>
            )}
            <div className="product-modal__price">{formattedPrice}</div>
            <div className="product-modal__quantity">
              <span>{quantityLabel}</span>
              <div className="product-modal__stepper">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Giảm số lượng"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                />
                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Tăng số lượng"
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>
            <div className="product-modal__footer">
              <div className="product-modal__total">
                <span>{totalLabel}</span>
                <strong>{formattedTotal}</strong>
              </div>
              <button
                type="button"
                className="product-modal__submit"
                onClick={handleSubmit}
              >
                {addToCartLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductQuickView;
