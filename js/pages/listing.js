import { getAllProducts } from "../services/productService.js";
import { getProductCardMarkup } from "../components/ProductCard.js";
import { calculateDiscountedPrice } from "../utils/helpers.js";
import { initCartBadge } from "../components/CartBadge.js";

const productsGrid = document.querySelector(".products__grid");
const subtitle = document.querySelector(".listing__subtitle");
const filtersOpenButton = document.querySelector(".listing__filters-btn");
const filtersCloseButton = document.querySelector(".sidebar__close");
const filtersBackdrop = document.querySelector(".filters-backdrop");

let allProducts = [];
let filteredProducts = [];

const FILTERS_OPEN_CLASS = "filters-open";

/* ===============================
   INITIAL LOAD
================================= */

async function loadProducts() {
  try {
    const products = await getAllProducts();

    // Add finalPrice for cleaner filtering
    allProducts = products.map(product => ({
      ...product,
      finalPrice: calculateDiscountedPrice(
        product.price,
        product.discountPercentage
      )
    }));

    filteredProducts = [...allProducts];

    renderProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
  } catch (error) {
    console.error("Error loading products:", error);
    productsGrid.innerHTML = `<p>Failed to load products.</p>`;
  }
}

/* ===============================
   RENDERING
================================= */

function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="products__empty">
        No products found matching your filters.
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const productCard = getProductCardMarkup(product);
    productsGrid.insertAdjacentHTML("beforeend", productCard);
  });
}

function updateProductCount(count) {
  subtitle.textContent = `${count} products available`;
}

/* ===============================
   FILTERING
================================= */

function applyFilters() {
  const selectedSize = getSelectedSize();
  const { min, max } = getPriceRange();
  const saleOnly = document.getElementById("saleOnly")?.checked;

  filteredProducts = allProducts.filter(product => {
    // Size filter
    if (selectedSize && !product.sizes.includes(selectedSize)) {
      return false;
    }

    // Price filter
    if (min !== null && product.finalPrice < min) return false;
    if (max !== null && product.finalPrice > max) return false;

    // Sale filter
    if (saleOnly && product.discountPercentage === 0) {
      return false;
    }

    return true;
  });

  renderProducts(filteredProducts);
  updateProductCount(filteredProducts.length);
}

/* ===============================
   HELPERS
================================= */

function getSelectedSize() {
  const activeBtn = document.querySelector(".sidebar__option.active");
  return activeBtn ? activeBtn.dataset.size : null;
}

function getPriceRange() {
  const minValue = parseFloat(document.getElementById("minPrice")?.value);
  const maxValue = parseFloat(document.getElementById("maxPrice")?.value);

  return {
    min: Number.isNaN(minValue) ? null : minValue,
    max: Number.isNaN(maxValue) ? null : maxValue
  };
}

/* ===============================
   EVENT LISTENERS
================================= */

// Size buttons
document.querySelectorAll(".sidebar__option").forEach(button => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar__option")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");
    applyFilters();
  });
});

// Price inputs
document.getElementById("minPrice")?.addEventListener("input", applyFilters);
document.getElementById("maxPrice")?.addEventListener("input", applyFilters);

// Sale checkbox
document.getElementById("saleOnly")?.addEventListener("change", applyFilters);

/* ===============================
   START APP
================================= */

loadProducts();
initCartBadge();

/* ===============================
   MOBILE FILTER DRAWER
================================= */

function openFiltersDrawer() {
  document.body.classList.add(FILTERS_OPEN_CLASS);
}

function closeFiltersDrawer() {
  document.body.classList.remove(FILTERS_OPEN_CLASS);
}

function initFiltersDrawer() {
  if (!filtersOpenButton || !filtersCloseButton || !filtersBackdrop) {
    return;
  }

  filtersOpenButton.addEventListener("click", openFiltersDrawer);
  filtersCloseButton.addEventListener("click", closeFiltersDrawer);
  filtersBackdrop.addEventListener("click", closeFiltersDrawer);

  window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeFiltersDrawer();
    }
  });
}

initFiltersDrawer();
