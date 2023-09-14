function formatCurrencyToRupiah(amount) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Opsional, untuk menghapus desimal jika tidak ada pecahan
    }).format(amount);
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam mengonversi nilai ke Rupiah:",
      error
    );
    return amount; // Mengembalikan nilai asli jika terjadi kesalahan
  }
}

module.exports = { formatCurrencyToRupiah };
