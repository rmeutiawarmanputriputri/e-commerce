async function loadProduct() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    //Jika ID tidak ada, tampilkan error
    if (!productId) {
      document.getElementById("product-container").innerHTML =
        "<p class='text-red-600'>Produk tidak ditemukan.</p>";
      return;
    }
    //Ambil data produk dari API
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    const product = await response.json();

    const html = `
      <div class="flex justify-center items-center">
        <img src="${
          product.image
        }" alt="Produk" class="w-64 h-auto object-contain" />
      </div>

      <div class="flex flex-col justify-between space-y-4">
        <div>
          <h2 class="text-xl font-semibold leading-snug">${product.title}</h2>
          <p class="text-sm text-gray-600 mt-1">${product.category}</p>

          <div class="flex items-center mt-2 space-x-1 text-yellow-400">
            <span>${"★".repeat(Math.floor(product.rating.rate)) + "☆"}</span>
          </div>

          <p class="text-lg font-bold text-red-600 mt-2">Rp. ${(
            product.price * 16000
          ).toLocaleString("id-ID")}</p>
        </div>

        <div class="flex gap-2 items-center">
          <button id="add-to-cart-btn" class="flex items-center justify-center w-10 h-10 border border-gray-600 rounded hover:bg-gray-100" title="Tambah ke Keranjang">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.2 6m12.2-6l1.2 6M6 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
            </svg>
          </button>
          <a href="checkout.html" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
          Pesan Sekarang
          </a>

        </div>
      </div>
    `;

    document.getElementById("product-container").innerHTML = html;

    // Fungsi update notifikasi jumlah item di icon cart
    function updateCartNotification() {
      const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      const countEl = document.getElementById("cart-count");
      if (countEl) {
        if (totalItems > 0) {
          countEl.textContent = totalItems;
          countEl.classList.remove("hidden");
        } else {
          countEl.classList.add("hidden");
        }
      }
    }

    // Tambahkan event listener untuk tombol add to cart
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      addToCart({
        id: product.id,
        title: product.title,
        category: product.category,
        price: Math.round(product.price * 16000), // convert ke rupiah bulat
        image: product.image,
        quantity: 1,
      });
      updateCartNotification(); // update notif setelah tambah cart
    });

    // Update notif saat halaman produk selesai dimuat
    updateCartNotification();
  } catch (error) {
    document.getElementById("product-container").innerHTML =
      "<p class='text-red-600'>Gagal memuat produk 😢</p>";
    console.error("Gagal ambil data:", error);
  }
}

function addToCart(product) {
  // Ambil keranjang dari localStorage
  let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

  // Cek jika produk sudah ada di keranjang
  const existingIndex = cart.findIndex((p) => p.id === product.id);
  if (existingIndex !== -1) {
    // Jika sudah ada, tambah quantity
    cart[existingIndex].quantity += 1;
  } else {
    // Jika belum ada, push baru
    cart.push(product);
  }

  // Simpan kembali ke localStorage
  localStorage.setItem("cartProducts", JSON.stringify(cart));

  alert("Produk berhasil ditambahkan ke keranjang!");
}

loadProduct();

document.addEventListener("DOMContentLoaded", () => {
  // Jika kamu tidak butuh event ini, bisa dihapus karena sudah ada di loadProduct()
});
