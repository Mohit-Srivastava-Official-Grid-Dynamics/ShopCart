import { calculateDiscountedPrice, formatCurrency } from "../utils/helpers.js";

export function getProductCardMarkup(product, options = {}) {
  const {
    variant = "grid",
    showLink = true,
    showBadge = true,
    showOriginalPrice = true,
    size = null,
    quantity = null,
    actionsMarkup = ""
  } = options;

  const finalPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  const badgeMarkup =
    showBadge && product.discountPercentage > 0
      ? `<span class="product-card__badge">
           ${product.discountPercentage}% OFF
         </span>`
      : "";

  const originalPriceMarkup =
    showOriginalPrice && product.discountPercentage > 0
      ? `<span class="product-card__price-old">
           ${formatCurrency(product.price)}
         </span>`
      : "";

  const metaParts = [];
  if (size) metaParts.push(`Size: ${size}`);
  if (quantity) metaParts.push(`Qty: ${quantity}`);

  const metaMarkup = metaParts.length
    ? `<div class="product-card__meta">${metaParts.join(" • ")}</div>`
    : "";

  const wrapperClass =
    variant === "row" ? "product-card product-card--row" : "product-card";

  const wrapperTag = showLink ? "a" : "article";
  const wrapperAttrs = showLink ? `href="product.html?id=${product.id}"` : "";

  return `
    <${wrapperTag} ${wrapperAttrs} class="${wrapperClass}">
      <div class="product-card__image-wrapper">
        ${badgeMarkup}
        <img src="${product.image}" alt="${product.name}" />
      </div>

      <div class="product-card__content">
        <div class="product-card__title">${product.name}</div>
        ${metaMarkup}

        <div class="product-card__price-wrapper">
          <span class="product-card__price">
            ${formatCurrency(finalPrice)}
          </span>
          ${originalPriceMarkup}
        </div>
        ${actionsMarkup}
      </div>
    </${wrapperTag}>
  `;
}
