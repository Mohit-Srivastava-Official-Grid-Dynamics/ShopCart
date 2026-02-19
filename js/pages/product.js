const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const productWrapper = document.querySelector(".product-page__wrapper");


// ===============================
// 2️⃣ Fetch Products
// ===============================

async function getProducts() {
  try {
    const response = await fetch("../../data/products.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}


// ===============================
// 3️⃣ Calculate Discounted Price
// ===============================

function calculateDiscountedPrice(price, discount) {
  if (!discount || discount === 0) return price;
  return Math.round(price - (price * discount) / 100);
}


// ===============================
// 4️⃣ Render Product
// ===============================

function renderProduct(product) {

  const finalPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  productWrapper.innerHTML = `
    <div class="product">

      <!-- LEFT SIDE (IMAGE) -->
      <div class="product__left">
        ${product.discountPercentage > 0
          ? `<span class="product__badge">
               ${product.discountPercentage}% OFF
             </span>`
          : ""}

        <img src="${product.image}" alt="${product.name}" />
      </div>


      <!-- RIGHT SIDE (DETAILS) -->
      <div class="product__right">

        ${product.discountPercentage > 0
          ? `<div class="product__offer">
               🎉 Flat ${product.discountPercentage}% OFF on this product
             </div>`
          : ""}

        <p class="product__category">
          ${product.category.toUpperCase()}
        </p>

        <h1 class="product__title">
          ${product.name}
        </h1>

        <div class="product__price">
          <span class="product__price--final">
            ₹${finalPrice}
          </span>

          ${product.discountPercentage > 0
            ? `<span class="product__price--original">
                 ₹${product.price}
               </span>`
            : ""}
        </div>

        <p class="product__description">
          ${product.description}
        </p>

        <div class="product__sizes">
          <p>Select Size</p>
          <div class="product__size-list">
            ${product.sizes.map(size =>
              `<button class="product__size" data-size="${size}">
                ${size}
              </button>`
            ).join("")}
          </div>
        </div>

        <button class="product__add-btn">
          🛒 Add to Cart
        </button>

      </div>
    </div>
  `;

  enableSizeSelection();
}


// ===============================
// 5️⃣ Size Selection Logic
// ===============================

function enableSizeSelection() {
  const sizeButtons = document.querySelectorAll(".product__size");

  sizeButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Remove active from all
      sizeButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      // Add active to clicked
      button.classList.add("active");
    });
  });
}


// ===============================
// 6️⃣ Initialize Page
// ===============================

async function init() {

  if (!productId) {
    productWrapper.innerHTML = "<p>Invalid product ID</p>";
    return;
  }

  const products = await getProducts();

  const product = products.find(p => p.id === productId);

  if (!product) {
    productWrapper.innerHTML = "<p>Product not found</p>";
    return;
  }

  renderProduct(product);
}

init();
