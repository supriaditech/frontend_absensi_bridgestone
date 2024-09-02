export function formatToLocalTime(isoString: string): string {
  const date = new Date(isoString);

  // Mengambil bagian jam, menit, detik dalam UTC
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Mengambil bagian tanggal, bulan, tahun dalam UTC
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Bulan dimulai dari 0
  const year = date.getUTCFullYear();

  // Format lengkap: DD-MM-YYYY HH:mm:ss
  const hasil = `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
  return hasil;
}
