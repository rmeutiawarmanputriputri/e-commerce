document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let products = [];

  function cleanPrice(price) {
    if (typeof price === "string") {
      return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    }
    return Number(price) || 0;
  }

  function saveToLocalStorage() {
    localStorage.setItem("cartProducts", JSON.stringify(products));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("cartProducts");
    if (saved) {
      products = JSON.parse(saved);

      // Konversi string harga ke angka (sekali saja)
      products = products.map((p) => ({
        ...p,
        price: cleanPrice(p.price),
        quantity: Number(p.quantity) || 1,
        checked: p.checked ?? true,
      }));
      return true;
    }
    return false;
  }

  function renderCart() {
    cartItemsEl.innerHTML = "";

    if (products.length === 0) {
      cartItemsEl.innerHTML = `<p class="text-center w-full py-10 text-gray-500">Keranjang masih kosong.</p>`;
      subtotalEl.textContent = "Rp. 0";
      totalEl.textContent = "Rp. 0";
      return;
    }

    products.forEach((product, index) => {
      const div = document.createElement("div");
      div.className =
        "flex border rounded shadow bg-white p-4 items-center mb-4";

      div.innerHTML = `
        <input type="checkbox" class="w-5 h-5 mr-4" data-index="${index}" ${
        product.checked ? "checked" : ""
      } />
        <img src="${
          product.image
        }" class="w-24 h-24 object-cover rounded mr-4" />
        <div class="flex-1">
          <h3 class="font-semibold text-base">${product.title}</h3>
          <p class="text-sm text-gray-500 mt-1">${product.category}</p>
          <div class="mt-2">
            <label class="text-sm">Jml:</label>
            <select class="ml-2 border rounded px-2 py-1" data-index="${index}">
              ${[...Array(10)]
                .map((_, i) => {
                  const val = i + 1;
                  return `<option value="${val}" ${
                    val === product.quantity ? "selected" : ""
                  }>${val}</option>`;
                })
                .join("")}
            </select>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold mb-4">Rp. ${product.price.toLocaleString(
            "id-ID"
          )}</p>
          <button class="text-gray-400 hover:text-red-600" data-remove="${index}">&times;</button>
        </div>
      `;

      cartItemsEl.appendChild(div);
    });

    attachEventListeners();
    updateTotals();
  }

  function attachEventListeners() {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        products[idx].checked = e.target.checked;
        saveToLocalStorage();
        updateTotals();
      });
    });

    document.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        products[idx].quantity = parseInt(e.target.value);
        saveToLocalStorage();
        updateTotals();
      });
    });

    document.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.remove;
        products.splice(idx, 1);
        saveToLocalStorage();
        renderCart();
      });
    });
  }

  function updateTotals() {
    let subtotal = 0;
    products.forEach((p) => {
      if (p.checked) {
        const price = Number(p.price);
        const qty = Number(p.quantity);
        subtotal += price * qty;
      }
    });

    subtotalEl.textContent = `Rp. ${subtotal.toLocaleString("id-ID")}`;
    totalEl.textContent = `Rp. ${subtotal.toLocaleString("id-ID")}`;
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const selectedItems = products.filter((p) => p.checked);
      const total = selectedItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      if (selectedItems.length === 0) {
        alert("Pilih minimal satu produk untuk checkout.");
        return;
      }

      localStorage.setItem("checkoutTotal", total);
      localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
      window.location.href = "checkout.html";
    });
  }

  if (!loadFromLocalStorage()) {
    cartItemsEl.innerHTML = `<p class="text-center w-full py-10 text-gray-500">Keranjang masih kosong.</p>`;
    subtotalEl.textContent = "Rp. 0";
    totalEl.textContent = "Rp. 0";
  } else {
    renderCart();
  }
});
