const hasStorage = (() => {
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
})();

export function getItem(key, fallback = null) {
  if (!hasStorage) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

export function setItem(key, value) {
  if (!hasStorage) return false;
  window.localStorage.setItem(key, JSON.stringify(value));
  return true;
}

export function removeItem(key) {
  if (!hasStorage) return false;
  window.localStorage.removeItem(key);
  return true;
}
