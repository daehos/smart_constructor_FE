const DEFAULT_VARIANTS = ["10x20x60 cm", "20x40x80 cm", "30x60x100 cm"];

export function getMaterialVariants(material) {
  const fromApi =
    material?.varian ??
    material?.variants ??
    material?.ukuranOptions ??
    material?.ukuran;
  if (Array.isArray(fromApi) && fromApi.length > 0) {
    return fromApi.map((v) =>
      typeof v === "string" ? v : (v?.label ?? v?.nama),
    );
  }
  return DEFAULT_VARIANTS;
}

export function mapMaterialToProduct(material) {
  const vendor = material?.vendor ?? {};
  return {
    id: material._id ?? material.id,
    namaMaterial: material.nama ?? "Material",
    hargaSatuan:
      Number(material.hargaTerakhir) ||
      Number(material.hargaSatuan) ||
      Number(material.price) ||
      0,
    kategori:
      material.kategori ??
      material.kategoriMaterial ??
      vendor.kategoriSpesialisasi ??
      "Umum",
    vendor: {
      _id: vendor._id ?? material.vendorId,
      namaPerusahaan:
        vendor.namaPerusahaan ?? vendor.namaBrand ?? material.vendorName,
      kategoriSpesialisasi: vendor.kategoriSpesialisasi,
      telepon: vendor.telepon ?? vendor.noHp ?? vendor.phone,
    },
    imageUrl:
      material.gambar ??
      material.imageUrl ??
      `https://dummyimage.com/300x300/e5e7eb/9ca3af.png&text=${material.nama}`,
    variants: getMaterialVariants(material),
  };
}

export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("62")
      ? digits
      : digits;
  const text = encodeURIComponent(message);
  return normalized
    ? `https://wa.me/${normalized}?text=${text}`
    : `https://wa.me/?text=${text}`;
}
