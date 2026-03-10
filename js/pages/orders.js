import { renderCartPage } from "./cartView.js";

renderCartPage({
  title: "My Orders",
  subtitle: "",
  countLabel: "orders",
  emptyTitle: "No orders yet",
  emptyMessage: "Looks like you haven't placed any orders yet.",
  emptyActionLabel: "Browse Products",
  emptyActionHref: "index.html",
  showActions: false,
  showSummary: false
});
