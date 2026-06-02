export function countOrdersBySummaryKey(orders) {
  const counts = {
    belumDitinjau: 0,
    ditolak: 0,
    diproses: 0,
    selesai: 0,
  };

  for (const order of orders ?? []) {
    const status = String(order?.status ?? "").toLowerCase();

    if (status === "selesai") {
      counts.selesai += 1;
    } else if (status === "dibatalkan" || status === "ditolak") {
      counts.ditolak += 1;
    } else if (status === "dikirim" || status === "diproses") {
      counts.diproses += 1;
    } else if (status === "pengembalian") {
      counts.belumDitinjau += 1;
    } else {
      counts.belumDitinjau += 1;
    }
  }

  return counts;
}
