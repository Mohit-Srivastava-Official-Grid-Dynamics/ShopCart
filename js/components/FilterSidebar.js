export function initFilterSidebar({ onChange } = {}) {
  const sizeButtons = Array.from(document.querySelectorAll(".sidebar__option"));
  const minInput = document.getElementById("minPrice");
  const maxInput = document.getElementById("maxPrice");
  const saleCheckbox = document.getElementById("saleOnly");
  const searchInput = document.getElementById("searchInput");
  const searchContainer = searchInput?.closest(".sidebar__search") ?? null;
  const suggestionButtons = Array.from(
    searchContainer?.querySelectorAll("[data-suggestion]") ?? []
  );
  const searchClearButton = searchContainer?.querySelector("[data-search-clear]");
  const searchFocusButton = searchContainer?.querySelector("[data-search-focus]");
  let activeSuggestionIndex = -1;
  let suppressFocusOpen = false;

  suggestionButtons.forEach((button, index) => {
    if (!button.id) {
      button.id = `search-suggestion-${index + 1}`;
    }
    button.setAttribute("role", "option");
  });

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

  function getSearchQuery() {
    return searchInput?.value.trim() ?? "";
  }

  function updateClearButton() {
    if (!searchInput || !searchClearButton) return;
    searchClearButton.hidden = searchInput.value.trim().length === 0;
  }

  function getVisibleSuggestions() {
    return suggestionButtons.filter(button => !button.hidden);
  }

  function updateSuggestionsVisibility(query) {
    const normalized = query.toLowerCase();
    suggestionButtons.forEach(button => {
      const label = (button.dataset.suggestion ?? button.textContent).toLowerCase();
      button.hidden = normalized ? !label.includes(normalized) : false;
    });
    return getVisibleSuggestions().length;
  }

  function clearActiveSuggestion() {
    suggestionButtons.forEach(button => {
      button.classList.remove("sidebar__search-option--active");
      button.setAttribute("aria-selected", "false");
    });
    activeSuggestionIndex = -1;
    searchInput?.removeAttribute("aria-activedescendant");
  }

  function setActiveSuggestion(index) {
    const visibleSuggestions = getVisibleSuggestions();
    if (!visibleSuggestions.length) return;
    const total = visibleSuggestions.length;
    const normalized = ((index % total) + total) % total;
    clearActiveSuggestion();
    activeSuggestionIndex = normalized;
    const activeButton = visibleSuggestions[normalized];
    activeButton.classList.add("sidebar__search-option--active");
    activeButton.setAttribute("aria-selected", "true");
    searchInput?.setAttribute("aria-activedescendant", activeButton.id);
  }

  function openSuggestions() {
    if (!searchContainer || !searchInput) return;
    searchContainer.classList.add("sidebar__search--open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function closeSuggestions() {
    if (!searchContainer || !searchInput) return;
    searchContainer.classList.remove("sidebar__search--open");
    searchInput.setAttribute("aria-expanded", "false");
    clearActiveSuggestion();
  }

  function getFilters() {
    const { min, max } = getPriceRange();
    return {
      search: getSearchQuery(),
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
  function applySuggestion(value) {
    if (!searchInput) return;
    suppressFocusOpen = true;
    searchInput.value = value;
    updateClearButton();
    notifyChange();
    closeSuggestions();
    searchInput.focus();
  }

  searchInput?.addEventListener("input", () => {
    updateClearButton();
    clearActiveSuggestion();
    const visibleCount = updateSuggestionsVisibility(searchInput.value.trim());
    if (visibleCount === 0 && searchInput.value.trim()) {
      closeSuggestions();
    } else {
      openSuggestions();
    }
    notifyChange();
  });
  searchInput?.addEventListener("focus", () => {
    if (suppressFocusOpen) {
      suppressFocusOpen = false;
      return;
    }
    const visibleCount = updateSuggestionsVisibility(searchInput.value.trim());
    if (visibleCount > 0) openSuggestions();
  });
  searchInput?.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const visibleSuggestions = getVisibleSuggestions();
      if (!visibleSuggestions.length) {
        closeSuggestions();
        return;
      }
      openSuggestions();
      const nextIndex =
        activeSuggestionIndex === -1 ? 0 : activeSuggestionIndex + 1;
      setActiveSuggestion(nextIndex);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const visibleSuggestions = getVisibleSuggestions();
      if (!visibleSuggestions.length) {
        closeSuggestions();
        return;
      }
      openSuggestions();
      const nextIndex =
        activeSuggestionIndex === -1
          ? visibleSuggestions.length - 1
          : activeSuggestionIndex - 1;
      setActiveSuggestion(nextIndex);
      return;
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      const chosen = getVisibleSuggestions()[activeSuggestionIndex];
      const value = chosen?.dataset.suggestion ?? chosen?.textContent.trim();
      if (value) applySuggestion(value);
      return;
    }

    if (event.key === "Enter") {
      closeSuggestions();
    }
  });
  searchFocusButton?.addEventListener("click", () => {
    searchInput?.focus();
    const visibleCount = updateSuggestionsVisibility(searchInput?.value.trim() ?? "");
    if (visibleCount > 0) openSuggestions();
  });
  searchClearButton?.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = "";
    updateClearButton();
    notifyChange();
    searchInput.focus();
    openSuggestions();
  });
  suggestionButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const value = button.dataset.suggestion ?? button.textContent.trim();
      if (value) applySuggestion(value);
    });
    button.addEventListener("mouseenter", () => {
      setActiveSuggestion(index);
    });
  });

  document.addEventListener("click", event => {
    if (!searchContainer) return;
    if (!searchContainer.contains(event.target)) {
      closeSuggestions();
    }
  });

  updateClearButton();
  updateSuggestionsVisibility(searchInput?.value.trim() ?? "");

  return { getFilters };
}
