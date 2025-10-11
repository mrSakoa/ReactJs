
const KEY = "cart";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:update"));
}

export function addItem(item) {
  const items = read();
  items.push(item);
  write(items);
}


export function removeItem(index) {
  const items = read();
  if (index >= 0 && index < items.length) {
    items.splice(index, 1);
    write(items);
  }
}

export function getItems() { return read(); }
export function getCount() { return read().length; }
export function getTotal() { return read().reduce((sum, item) => sum + (item.price || 0), 0);}
