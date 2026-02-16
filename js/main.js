import { HomePage } from "./pages/HomePage.js";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.js";
import { OrdersPage } from "./pages/OrdersPage.js";

const app = document.getElementById("app");

const path = window.location.pathname;

if (path.includes("product.html")) {
  ProductDetailsPage(app);
} else if (path.includes("orders.html")) {
  OrdersPage(app);
} else {
  HomePage(app);
}
