import { getProductById } from "../services/productService.js";
import { calculateDiscountedPrice, formatCurrency } from "../utils/helpers.js";
import { initSizeSelector } from "../components/SizeSelector.js";
import { addToCart } from "../services/cartService.js";
import { showToast } from "../components/Toast.js";
import { initCartBadge, updateCartBadge } from "../components/CartBadge.js";

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const productWrapper = document.querySelector(".product-page__wrapper");

function showLoadingState() {
  if (!productWrapper) return;
  productWrapper.innerHTML = `
    <div class="state-message">Loading product...</div>
  `;
}

function showErrorState(message) {
  if (!productWrapper) return;
  productWrapper.innerHTML = `
    <div class="state-message state-message--error">${message}</div>
  `;
}

function renderProduct(product) {
  const finalPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  productWrapper.innerHTML = `
    <div class="product">
      <!-- LEFT SIDE (IMAGE) -->
      <div class="product__left">
        ${product.discountPercentage > 0
          ? `<span class="product__badge">
               ${product.discountPercentage}% OFF
             </span>`
          : ""}

        <img src="${product.image}" alt="${product.name}" />
      </div>

      <!-- RIGHT SIDE (DETAILS) -->
      <div class="product__right">
        ${product.discountPercentage > 0
          ? `<div class="product__offer">
               🎉 Flat ${product.discountPercentage}% OFF on this product
             </div>`
          : ""}

        <p class="product__category">
          ${product.category.toUpperCase()}
        </p>

        <h1 class="product__title">
          ${product.name}
        </h1>

        <div class="product__price">
          <span class="product__price--final">
            ${formatCurrency(finalPrice)}
          </span>

          ${product.discountPercentage > 0
            ? `<span class="product__price--original">
                 ${formatCurrency(product.price)}
               </span>`
            : ""}
        </div>

        <p class="product__description">
          ${product.description}
        </p>

        <div class="product__sizes">
          <p>Select Size</p>
          <div class="product__size-list" data-size-selector>
            ${product.sizes
              .map(
                size => `<button class="product__size" data-size="${size}">
                ${size}
              </button>`
              )
              .join("")}
          </div>
        </div>

        <button class="product__add-btn" type="button">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `;

  const sizeSelector = document.querySelector("[data-size-selector]");
  const getSelectedSize = initSizeSelector(sizeSelector);

  const addButton = document.querySelector(".product__add-btn");
  addButton.addEventListener("click", () => {
    const selectedSize = getSelectedSize();
    addToCart(product, selectedSize);
    updateCartBadge();

    showToast({
      title: "Product added to cart successfully",
      message: `${product.name} (${selectedSize}) has been added.`
    });
  });
}

async function init() {
  initCartBadge();

  if (!productId) {
    showErrorState("Invalid product ID");
    return;
  }

  showLoadingState();
  const product = await getProductById(productId);

  if (!product) {
    showErrorState("Product not found");
    return;
  }

  renderProduct(product);
}

init();
