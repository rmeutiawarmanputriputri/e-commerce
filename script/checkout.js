window.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("totalHarga");
  const subtotalEl = document.getElementById("subtotalHarga"); // opsional jika kamu ingin tampilkan subtotal juga
  const products = JSON.parse(localStorage.getItem("checkoutItems")) || [];

  // Hitung Total Harga
  function updateTotals() {
    let subtotal = 0;
    products.forEach((p) => {
      subtotal += p.quantity * p.price;
    });

    if (totalEl) {
      totalEl.textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
    }
    if (subtotalEl) {
      subtotalEl.textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
    }
  }

  updateTotals(); // jalankan langsung saat halaman dimuat

  // Tanggal & waktu sekarang + pengiriman
  const now = new Date();
  const pengiriman = new Date(now);
  pengiriman.setDate(now.getDate() + 3);

  document.getElementById("waktuSekarang").textContent = now.toLocaleTimeString("id-ID");
  document.getElementById("tanggalPengiriman").textContent = pengiriman.toLocaleDateString("id-ID");



  // Tampilkan form pembayaran
  document.getElementById("paymentOverlay").classList.remove("hidden");

  // Tombol kembali ke homepage
  const backBtn = document.getElementById("backHomeBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      localStorage.removeItem("cartProducts");
      window.location.href = "home.html";
    });
  }
});

function submitPembayaran() {
  const nama = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  const metode = document.querySelector("input[name='paymentMethod']:checked")?.value;

  if (!nama || !alamat || !telepon || !metode) {
    alert("Harap lengkapi semua data dan pilih metode pembayaran.");
    return;
  }

  document.getElementById("paymentOverlay").classList.add("hidden");
  document.getElementById("successPopup").classList.remove("hidden");
}

// Fungsi untuk aktifkan edit input
function enableEdit(fieldId) {
  const field = document.getElementById(fieldId);
  field.removeAttribute("readonly");
  field.focus();
}
