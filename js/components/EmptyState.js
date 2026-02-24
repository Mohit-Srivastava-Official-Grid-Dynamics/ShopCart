export function renderEmptyState(
  container,
  { title, message, actionLabel, actionHref }
) {
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i data-lucide="shopping-bag"></i>
      </div>
      <div class="empty-state__content">
        <h2 class="empty-state__title">${title}</h2>
        <p class="empty-state__message">${message}</p>
      </div>
      <a class="btn" href="${actionHref}">${actionLabel}</a>
    </div>
  `;

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}
