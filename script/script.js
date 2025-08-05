document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) {
    console.error("Elemen #product-grid tidak ditemukan.");
    return;
  }

  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        const card = document.createElement("div");
        card.className =
          "bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl relative";

        const hargaRupiah = product.price * 16000;

        card.innerHTML = `
          <img src="${product.image}" alt="${
          product.title
        }" class="w-full h-48 object-contain p-4">
          <div class="p-4">
            <h3 class="text-sm font-semibold line-clamp-2 mb-1">${
              product.title
            }</h3>
            <p class="text-xs text-gray-600 mb-1">${product.category}</p>
            <p class="font-bold text-black mb-2">Rp ${hargaRupiah.toLocaleString(
              "id-ID"
            )}</p>
            <div class="flex justify-end">
              <button class="btn-keranjang relative z-10 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:bg-gray-200 transition">
                <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Keranjang" class="w-6 h-6" />
                <span class="text-sm font-medium">Keranjang</span>
              </button>
            </div>
          </div>
        `;

        // Tambahkan event ke tombol keranjang sebelum card diklik
        const btnKeranjang = card.querySelector(".btn-keranjang");
        btnKeranjang.addEventListener("click", (e) => {
          e.stopPropagation(); // Hindari klik ke detail

          let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

          const existing = cart.find((item) => item.id === product.id);
          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              qty: 1,
            });
          }

          localStorage.setItem("cartProducts", JSON.stringify(cart));
          alert("Produk ditambahkan ke keranjang!");
        });

        // Event klik ke card → buka halaman detail
        card.addEventListener("click", (e) => {
          // Jika yang diklik adalah tombol keranjang, abaikan
          if (e.target.closest(".btn-keranjang")) return;
          window.location.href = `detail.html?id=${product.id}`;
        });

        productGrid.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Gagal memuat produk:", error);
      productGrid.innerHTML =
        "<p class='text-red-500'>Gagal memuat produk.</p>";
    });
});

// ====== SLIDER (dengan validasi) ======
const slides = document.getElementById("slides");
if (slides) {
  const totalSlides = slides.children.length;
  let currentIndex = 0;

  document.getElementById("prev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  document.getElementById("next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });
}
