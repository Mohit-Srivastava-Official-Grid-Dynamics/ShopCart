const PRODUCTS_URL = "../../data/products.json";

export async function getAllProducts() {
  try {
    const response = await fetch(PRODUCTS_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Product Service Error:", error);
    return [];
  }
}
