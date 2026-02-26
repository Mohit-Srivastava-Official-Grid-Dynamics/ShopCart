export function initFilterSidebar({ onChange } = {}) {
  const sizeButtons = Array.from(document.querySelectorAll(".sidebar__option"));
  const minInput = document.getElementById("minPrice");
  const maxInput = document.getElementById("maxPrice");
  const saleCheckbox = document.getElementById("saleOnly");

  function getSelectedSize() {
    const activeBtn = sizeButtons.find(button =>
      button.classList.contains("active")
    );
    return activeBtn ? activeBtn.dataset.size : null;
  }

  function getPriceRange() {
    const minValue = parseFloat(minInput?.value);
    const maxValue = parseFloat(maxInput?.value);

    return {
      min: Number.isNaN(minValue) ? null : minValue,
      max: Number.isNaN(maxValue) ? null : maxValue
    };
  }

  function getFilters() {
    const { min, max } = getPriceRange();
    return {
      size: getSelectedSize(),
      min,
      max,
      saleOnly: Boolean(saleCheckbox?.checked)
    };
  }

  function notifyChange() {
    if (typeof onChange === "function") {
      onChange(getFilters());
    }
  }

  sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
      sizeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      notifyChange();
    });
  });

  minInput?.addEventListener("input", notifyChange);
  maxInput?.addEventListener("input", notifyChange);
  saleCheckbox?.addEventListener("change", notifyChange);

  return { getFilters };
}
