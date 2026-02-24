import { getItem, setItem } from "../utils/storage.js";
import { calculateDiscountedPrice } from "../utils/helpers.js";

const CART_KEY = "cartItems";

function normalizeCartItems(items) {
  return Array.isArray(items) ? items : [];
}

export function getCartItems() {
  return normalizeCartItems(getItem(CART_KEY, []));
}

export function addToCart(product, selectedSize) {
  // Cart logic: if the same product + size exists, increase quantity.
  const cartItems = getCartItems();
  const existingIndex = cartItems.findIndex(
    item => item.id === product.id && item.size === selectedSize
  );

  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      image: product.image,
      size: selectedSize,
      quantity: 1
    });
  }

  setItem(CART_KEY, cartItems);
  return cartItems;
}

export function updateCartItemQuantity(id, size, quantity) {
  const cartItems = getCartItems();
  const nextQuantity = Math.max(1, quantity);
  const updatedItems = cartItems.map(item =>
    item.id === id && item.size === size
      ? { ...item, quantity: nextQuantity }
      : item
  );

  setItem(CART_KEY, updatedItems);
  return updatedItems;
}

export function removeFromCart(id, size) {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter(
    item => !(item.id === id && item.size === size)
  );

  setItem(CART_KEY, updatedItems);
  return updatedItems;
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal() {
  return getCartItems().reduce((total, item) => {
    const finalPrice = calculateDiscountedPrice(
      item.price,
      item.discountPercentage
    );
    return total + finalPrice * item.quantity;
  }, 0);
}
