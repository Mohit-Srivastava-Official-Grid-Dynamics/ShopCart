import { getCartCount } from "../services/cartService.js";

function updateBadgeElement(element, count) {
  if (count > 0) {
    element.textContent = count;
    element.hidden = false;
  } else {
    element.textContent = "";
    element.hidden = true;
  }
}

export function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll("[data-cart-badge]");
  badges.forEach(badge => updateBadgeElement(badge, count));
}

export function initCartBadge() {
  updateCartBadge();
}
