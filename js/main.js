import { HomePage } from "./pages/listing.js";
import { ProductDetailsPage } from "./pages/product.js";
import { OrdersPage } from "./pages/orders.js";

const app = document.getElementById("app");

const path = window.location.pathname;

if (path.includes("product.html")) {
  ProductDetailsPage(app);
} else if (path.includes("orders.html")) {
  OrdersPage(app);
} else {
  HomePage(app);
}
