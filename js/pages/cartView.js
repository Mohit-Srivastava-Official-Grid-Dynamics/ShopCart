import { getCartItems, getCartSubtotal } from "../services/cartService.js";
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
            quantity: item.quantity
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
