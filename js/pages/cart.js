import { renderCartPage } from "./cartView.js";

renderCartPage({
  title: "Your Cart",
  subtitle: "",
  emptyTitle: "Your cart is empty",
  emptyMessage: "Looks like you haven't added anything to your cart yet.",
  emptyActionLabel: "Browse Products",
  emptyActionHref: "index.html"
});
