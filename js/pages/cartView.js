import {
  getCartItems,
  getCartSubtotal,
  removeFromCart,
  updateCartItemQuantity
} from "../services/cartService.js";
import { formatCurrency } from "../utils/helpers.js";
import { renderEmptyState } from "../components/EmptyState.js";
import { initCartBadge } from "../components/CartBadge.js";
import { getProductCardMarkup } from "../components/ProductCard.js";

export function renderCartPage({
  title = "Your Cart",
  subtitle = "",
  countLabel = "cart",
  emptyTitle = "Your cart is empty",
  emptyMessage = "Looks like you haven't added anything to your cart yet.",
  emptyActionLabel = "Browse Products",
  emptyActionHref = "index.html"
} = {}) {
  const config = {
    title,
    subtitle,
    countLabel,
    emptyTitle,
    emptyMessage,
    emptyActionLabel,
    emptyActionHref
  };

  initCartBadge();

  const titleEl = document.querySelector("[data-cart-title]");
  const subtitleEl = document.querySelector("[data-cart-subtitle]");
  const contentEl = document.querySelector("[data-cart-content]");

  if (titleEl) titleEl.textContent = title;

  const cartItems = getCartItems();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (subtitleEl) {
    subtitleEl.textContent = totalItems
      ? `${totalItems} item${totalItems === 1 ? "" : "s"} in your ${countLabel}`
      : subtitle;
  }

  if (!contentEl) return;

  bindCartActions(contentEl, config);

  if (cartItems.length === 0) {
    renderEmptyState(contentEl, {
      title: emptyTitle,
      message: emptyMessage,
      actionLabel: emptyActionLabel,
      actionHref: emptyActionHref
    });
    return;
  }

  const listMarkup = `
    <div class="cart-list">
      ${cartItems
        .map(item =>
          getProductCardMarkup(item, {
            variant: "row",
            showLink: true,
            showBadge: false,
            size: item.size,
            quantity: item.quantity,
            actionsMarkup: `
              <div class="cart-item__actions">
                <div class="cart-item__quantity" role="group" aria-label="Quantity controls">
                  <button
                    type="button"
                    class="qty-btn"
                    data-qty-decrease
                    data-item-id="${item.id}"
                    data-item-size="${item.size}"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span class="cart-item__qty-value">${item.quantity}</span>
                  <button
                    type="button"
                    class="qty-btn"
                    data-qty-increase
                    data-item-id="${item.id}"
                    data-item-size="${item.size}"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn--outline btn--sm"
                  data-remove-item
                  data-item-id="${item.id}"
                  data-item-size="${item.size}"
                >
                  Remove
                </button>
              </div>
            `
          })
        )
        .join("")}
    </div>
  `;

  const subtotal = getCartSubtotal();
  const summaryMarkup = `
    <div class="cart-summary">
      <div class="cart-summary__row">
        <span>Items</span>
        <span>${totalItems}</span>
      </div>
      <div class="cart-summary__row">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <button class="btn" type="button">Proceed to Checkout</button>
    </div>
  `;

  contentEl.innerHTML = listMarkup + summaryMarkup;
}

function bindCartActions(container, config) {
  if (container.dataset.cartActionsBound === "true") return;
  container.dataset.cartActionsBound = "true";

  container.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-item]");
    const increaseButton = event.target.closest("[data-qty-increase]");
    const decreaseButton = event.target.closest("[data-qty-decrease]");

    if (removeButton) {
      event.preventDefault();
      event.stopPropagation();
      const id = Number(removeButton.dataset.itemId);
      const size = removeButton.dataset.itemSize;
      removeFromCart(id, size);
      renderCartPage(config);
      return;
    }

    if (increaseButton || decreaseButton) {
      event.preventDefault();
      event.stopPropagation();
      const button = increaseButton || decreaseButton;
      const id = Number(button.dataset.itemId);
      const size = button.dataset.itemSize;
      const item = getCartItems().find(
        entry => entry.id === id && entry.size === size
      );

      if (!item) return;

      const nextQuantity = increaseButton
        ? item.quantity + 1
        : item.quantity - 1;

      updateCartItemQuantity(id, size, nextQuantity);
      renderCartPage(config);
    }
  });
}
