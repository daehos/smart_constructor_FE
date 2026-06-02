import {
  mapOcrToForm,
  parseIdrAmount,
  parseItemsFromLines,
} from "./mapOcrToForm";

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

function getValidParsedItems(parsed) {
  return (parsed?.items ?? []).filter((item) => !isSuspiciousParsedItem(item));
}

export function getReceiptProductCount(receipt) {
  const lineTexts =
    receipt?.rawOcr?.lines?.map((l) =>
      typeof l === "string" ? l : l?.text ?? "",
    ) ?? [];
  const fromLines = parseItemsFromLines(lineTexts);
  if (fromLines.length > 0) return fromLines.length;

  const valid = getValidParsedItems(receipt?.parsed);
  return valid.length;
}

export function getReceiptTotal(receipt) {
  const parsed = receipt?.parsed;
  const total = Number(parsed?.total);
  if (total > 0 && total < 100_000_000) return total;

  const valid = getValidParsedItems(parsed);
  let sum = valid.reduce((acc, item) => {
    const sub =
      Number(item.subtotal) ||
      (Number(item.qty) || 1) * (Number(item.price) || 0);
    return sub > 0 && sub < 100_000_000 ? acc + sub : acc;
  }, 0);
  if (sum > 0) return sum;

  const lineTexts =
    receipt?.rawOcr?.lines?.map((l) =>
      typeof l === "string" ? l : l?.text ?? "",
    ) ?? [];
  for (const line of lineTexts) {
    const normalized = line.toLowerCase();
    if (
      /total|grand|jumlah bayar|inta!/i.test(normalized) &&
      !/subtotal|item/i.test(normalized)
    ) {
      const amount = parseIdrAmount(line);
      if (amount > 0 && amount < 100_000_000) return amount;
    }
  }

  const { items } = mapOcrToForm(receipt);
  return items.reduce((acc, item) => {
    const qty = Number(item.jumlah) || 0;
    const price = Number(item.hargaSatuan) || 0;
    return acc + qty * price;
  }, 0);
}

export function mapReceiptToListItem(receipt, index = 0) {
  const parsed = receipt?.parsed ?? {};
  const merchant = parsed.merchant?.trim() || "Tanpa nama";
  const tanggal =
    parsed.date ||
    (receipt?.createdAt ? String(receipt.createdAt).slice(0, 10) : "");

  return {
    id: receipt._id,
    namaTransaksi: merchant,
    kategori: receipt?.linkedOrder?.kategori ?? "Umum",
    productCount: getReceiptProductCount(receipt),
    jumlah: getReceiptTotal(receipt),
    tanggal,
    status: receipt?.status,
    iconVariant: index % 4,
  };
}
