let toastContainer = null;

function ensureContainer() {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("aria-atomic", "true");
  document.body.appendChild(toastContainer);

  return toastContainer;
}

export function showToast({
  title,
  message,
  variant = "success",
  duration = 2800
}) {
  const container = ensureContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast--${variant}`;

  toast.innerHTML = `
    <div class="toast__title">${title}</div>
    <div class="toast__message">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--fade");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, duration);
}
