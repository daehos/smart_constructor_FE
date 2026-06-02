export const emptyFormItem = () => ({
  id: crypto.randomUUID(),
  namaProduk: "",
  jumlah: "",
  satuan: "",
  hargaSatuan: "",
});

/** Parse "40.000", "Q40.000", "40. 000" → 40000 */
export function parseIdrAmount(text) {
  if (!text) return 0;
  const digits = String(text).replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
}

/**
 * Extract line items from OCR bbox lines using receipt layout:
 * product name → "{qty}x" → price line
 */
export function parseItemsFromLines(lines) {
  const results = [];
  const trimmed = lines.map((l) => (typeof l === "string" ? l : l?.text ?? "").trim());

  for (let i = 0; i < trimmed.length; i += 1) {
    const line = trimmed[i];
    const qtyMatch = line.match(/^(\d+)\s*x$/i);
    if (!qtyMatch || i < 1) continue;

    const namaProduk = trimmed[i - 1];
    if (!namaProduk || isMetadataLine(namaProduk)) continue;

    const priceLine = trimmed[i + 1] ?? "";
    const hargaSatuan = parseIdrAmount(priceLine);
    if (hargaSatuan <= 0) continue;

    results.push({
      id: crypto.randomUUID(),
      namaProduk,
      jumlah: String(parseInt(qtyMatch[1], 10)),
      satuan: "pcs",
      hargaSatuan: String(hargaSatuan),
    });
  }

  return results;
}

function isMetadataLine(text) {
  const lower = text.toLowerCase();
  return (
    /^:/.test(text) ||
    /^(tanggal|jam|info|no meja|mode|kasir|subtotal|total|pb1|service)/i.test(
      lower,
    ) ||
    /^\d{2}-\d{2}-\d{4}/.test(text)
  );
}

function isSuspiciousParsedItem(item) {
  const name = (item?.name ?? "").trim();
  const price = Number(item?.price) || 0;
  return (
    !name ||
    name.startsWith(":") ||
    price <= 0 ||
    price > 100_000_000 ||
    name.length < 2
  );
}

function mapParsedItemsToForm(parsedItems) {
  if (!Array.isArray(parsedItems)) return [];
  return parsedItems
    .filter((item) => !isSuspiciousParsedItem(item))
    .map((item) => ({
      id: crypto.randomUUID(),
      namaProduk: item.name ?? "",
      jumlah: item.qty != null ? String(item.qty) : "",
      satuan: "",
      hargaSatuan: item.price != null ? String(item.price) : "",
    }));
}

/**
 * Map receipt OCR payload to manual input form fields.
 * Prefers line-based parsing; falls back to filtered parsed.items.
 */
export function mapOcrToForm(ocrData) {
  if (!ocrData) {
    return {
      tanggal: "",
      catatan: "",
      items: [emptyFormItem()],
    };
  }

  const { parsed, rawOcr } = ocrData;
  const tanggal = parsed?.date ?? "";
  const catatan = parsed?.merchant?.trim() ?? "";

  const lineTexts =
    rawOcr?.lines?.map((l) => (typeof l === "string" ? l : l?.text ?? "")) ?? [];

  const fromLines = parseItemsFromLines(lineTexts);
  const fromParsed = mapParsedItemsToForm(parsed?.items);

  const items =
    fromLines.length > 0
      ? fromLines
      : fromParsed.length > 0
        ? fromParsed
        : [emptyFormItem()];

  return { tanggal, catatan, items };
}
