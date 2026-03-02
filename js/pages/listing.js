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
const paginationContainer = document.querySelector("[data-pagination]");

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

const FILTERS_OPEN_CLASS = "filters-open";
const PAGE_SIZE = 9;

function showLoadingState() {
  if (!productsGrid) return;
  productsGrid.innerHTML = `
    <div class="state-message">Loading products...</div>
  `;
  if (paginationContainer) paginationContainer.innerHTML = "";
}

function showErrorState() {
  if (!productsGrid) return;
  productsGrid.innerHTML = `
    <div class="state-message state-message--error">
      Failed to load products.
    </div>
  `;
  if (paginationContainer) paginationContainer.innerHTML = "";
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
    renderPagination(0);
    return;
  }

  const pagedProducts = getPagedProducts(products);

  pagedProducts.forEach(product => {
    const productCard = getProductCardMarkup(product);
    productsGrid.insertAdjacentHTML("beforeend", productCard);
  });

  renderPagination(products.length);
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

  currentPage = 1;
  renderProducts(filteredProducts);
  updateProductCount(filteredProducts.length);
}

function getPagedProducts(products) {
  const start = (currentPage - 1) * PAGE_SIZE;
  return products.slice(start, start + PAGE_SIZE);
}

function renderPagination(totalItems) {
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const buttons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const activeClass = page === currentPage ? "pagination__btn--active" : "";
    return `<button class="pagination__btn ${activeClass}" data-page="${page}">${page}</button>`;
  }).join("");

  paginationContainer.innerHTML = buttons;
}

function initPagination() {
  if (!paginationContainer) return;

  paginationContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (!button) return;

    const nextPage = Number(button.dataset.page);
    if (Number.isNaN(nextPage) || nextPage === currentPage) return;

    currentPage = nextPage;
    renderProducts(filteredProducts);
  });
}

/* ===============================
   START APP
================================= */

loadProducts();
initCartBadge();
initPagination();

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
