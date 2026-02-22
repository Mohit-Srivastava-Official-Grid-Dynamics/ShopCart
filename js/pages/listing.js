// listing.js

const productsGrid = document.querySelector(".products__grid");
const subtitle = document.querySelector(".listing__subtitle");

let allProducts = [];
let filteredProducts = [];

/* ===============================
   INITIAL LOAD
================================= */

async function loadProducts() {
  try {
    const response = await fetch("../../data/products.json");
    const products = await response.json();

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

    const productCard = `
      <a href="product.html?id=${product.id}" class="product-card">

        <div class="product-card__image-wrapper">
          ${product.discountPercentage > 0
            ? `<span class="product-card__badge">
                 ${product.discountPercentage}% OFF
               </span>`
            : ""}
          <img src="${product.image}" alt="${product.name}" />
        </div>

        <div class="product-card__content">
          <div class="product-card__title">${product.name}</div>

          <div class="product-card__price-wrapper">
            <span class="product-card__price">
              ₹${product.finalPrice}
            </span>

            ${product.discountPercentage > 0
              ? `<span class="product-card__price-old">
                   ₹${product.price}
                 </span>`
              : ""}
          </div>
        </div>

      </a>
    `;

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

function calculateDiscountedPrice(price, discount) {
  if (discount === 0) return price;
  return Math.round(price - (price * discount) / 100);
}

function getSelectedSize() {
  const activeBtn = document.querySelector(".sidebar__option.active");
  return activeBtn ? activeBtn.dataset.size : null;
}

function getPriceRange() {
  const minValue = parseFloat(document.getElementById("minPrice")?.value);
  const maxValue = parseFloat(document.getElementById("maxPrice")?.value);

  return {
    min: isNaN(minValue) ? null : minValue,
    max: isNaN(maxValue) ? null : maxValue
  };
}

/* ===============================
   EVENT LISTENERS
================================= */

// Size buttons
document.querySelectorAll(".sidebar__option").forEach(button => {
  button.addEventListener("click", () => {

    document.querySelectorAll(".sidebar__option")
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