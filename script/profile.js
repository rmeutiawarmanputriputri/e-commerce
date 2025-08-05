document.addEventListener("DOMContentLoaded", () => {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const birthday = document.getElementById("birthday");
  const password = document.getElementById("password");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const form = document.getElementById("profileForm");

  // Ambil dari localStorage atau default
  const stored = JSON.parse(localStorage.getItem("userProfile")) || {
    fullName: "Park Solomon",
    email: "lamonsalmon@gmail.com",
    birthday: "1989-11-11",
    password: "password123",
  };

  // Masukkan ke input
  fullName.value = stored.fullName;
  email.value = stored.email;
  birthday.value = stored.birthday;
  password.value = stored.password;

  // Edit Mode
  editBtn.addEventListener("click", () => {
    fullName.disabled = false;
    email.disabled = false;
    birthday.disabled = false;
    password.disabled = false;
    saveBtn.classList.remove("hidden");
  });

  // Simpan perubahan
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProfile = {
      fullName: fullName.value,
      email: email.value,
      birthday: birthday.value,
      password: password.value,
    };

    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    alert("Data berhasil disimpan!");

    fullName.disabled = true;
    email.disabled = true;
    birthday.disabled = true;
    password.disabled = true;
    saveBtn.classList.add("hidden");
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem("userProfile");
      window.location.href = "login.html"; // ganti sesuai halaman login kamu
    }
  });
});
