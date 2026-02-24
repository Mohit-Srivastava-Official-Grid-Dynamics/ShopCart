import { getAllProducts } from "../services/productService.js";
import { getProductCardMarkup } from "../components/ProductCard.js";
import { calculateDiscountedPrice } from "../utils/helpers.js";
import { initCartBadge } from "../components/CartBadge.js";
import { initFilterSidebar } from "../components/FilterSidebar.js";

const productsGrid = document.querySelector(".products__grid");
const subtitle = document.querySelector(".listing__subtitle");
const filtersOpenButton = document.querySelector(".listing__filters-btn");
const filtersCloseButton = document.querySelector(".sidebar__close");
const filtersBackdrop = document.querySelector(".filters-backdrop");

let allProducts = [];
let filteredProducts = [];

const FILTERS_OPEN_CLASS = "filters-open";

function showLoadingState() {
  if (!productsGrid) return;
  productsGrid.innerHTML = `
    <div class="state-message">Loading products...</div>
  `;
}

function showErrorState() {
  if (!productsGrid) return;
  productsGrid.innerHTML = `
    <div class="state-message state-message--error">
      Failed to load products.
    </div>
  `;
}

/* ===============================
   INITIAL LOAD
================================= */

async function loadProducts() {
  try {
    showLoadingState();
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
    showErrorState();
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

const filterControls = initFilterSidebar({
  onChange: filters => applyFilters(filters)
});

function applyFilters(filters = filterControls?.getFilters?.()) {
  if (!filters) return;

  const { size, min, max, saleOnly } = filters;

  filteredProducts = allProducts.filter(product => {
    // Size filter
    if (size && !product.sizes.includes(size)) {
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
