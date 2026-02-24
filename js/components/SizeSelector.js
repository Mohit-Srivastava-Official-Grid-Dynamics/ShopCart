export function initSizeSelector(container, defaultIndex = 0) {
  if (!container) return () => null;

  const buttons = Array.from(container.querySelectorAll("[data-size]"));
  if (!buttons.length) return () => null;

  function setActiveSize(size) {
    buttons.forEach(button => {
      button.classList.toggle("active", button.dataset.size === size);
    });
  }

  const fallback = buttons[Math.min(defaultIndex, buttons.length - 1)].dataset.size;
  setActiveSize(fallback);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      setActiveSize(button.dataset.size);
    });
  });

  return () => {
    const active = buttons.find(button => button.classList.contains("active"));
    return active ? active.dataset.size : null;
  };
}
