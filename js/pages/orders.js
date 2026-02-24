import { renderCartPage } from "./cartView.js";

renderCartPage({
  title: "My Orders",
  subtitle: "Your saved items and recent orders.",
  countLabel: "orders",
  emptyTitle: "No orders yet",
  emptyMessage: "Looks like you haven't placed any orders yet.",
  emptyActionLabel: "Browse Products",
  emptyActionHref: "index.html"
});
