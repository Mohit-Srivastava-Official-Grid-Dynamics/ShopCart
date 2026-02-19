// listing.js

const productsGrid = document.querySelector(".products__grid");

async function loadProducts() {
  try {
    const response = await fetch("../../data/products.json");
    const products = await response.json();

    renderProducts(products);
    updateProductCount(products.length);

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts(products) {
  productsGrid.innerHTML = "";

  products.forEach(product => {

    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discountPercentage
    );

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
              ₹${discountedPrice}
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



function calculateDiscountedPrice(price, discount) {
  if (discount === 0) return price;
  return Math.round(price - (price * discount) / 100);
}

function updateProductCount(count) {
  const subtitle = document.querySelector(".listing__subtitle");
  subtitle.textContent = `${count} products available`;
}

loadProducts();
