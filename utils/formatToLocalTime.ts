export function formatToLocalTime(isoString: string): string {
  const date = new Date(isoString);

  // Mengambil bagian jam, menit, detik
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Mengambil bagian tanggal, bulan, tahun
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Bulan dimulai dari 0
  const year = date.getFullYear();

  // Format lengkap: DD-MM-YYYY HH:mm:ss
  return `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
}
