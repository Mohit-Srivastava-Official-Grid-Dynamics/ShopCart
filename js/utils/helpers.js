export function calculateDiscountedPrice(price, discountPercentage = 0) {
  if (!discountPercentage) return price;
  return Math.round(price - (price * discountPercentage) / 100);
}

export function formatCurrency(amount) {
  if (Number.isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }

  const formatter = new Intl.NumberFormat("en-IN");
  return `₹${formatter.format(amount)}`;
}
