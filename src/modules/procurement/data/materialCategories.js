import arsitekturalImg from "../assets/arsitektural.png";
import interiorImg from "../assets/interior.png";
import mekanikalImg from "../assets/mekanikal.png";
import strukturalImg from "../assets/struktural.png";

export const MATERIAL_CATEGORIES = [
  {
    id: "interior",
    title: "Interior",
    bg: "bg-[#fcdada]",
    image: interiorImg,
  },
  {
    id: "arsitektural",
    title: "Arsitektural",
    bg: "bg-[#FEF3C7]",
    image: arsitekturalImg,
  },
  {
    id: "struktural",
    title: "Struktural",
    bg: "bg-[#DBEAFE]",
    image: strukturalImg,
  },
  {
    id: "mep",
    title: "Mekanikal, Elektrikal, Pipa",
    bg: "bg-[#D1FAE5]",
    image: mekanikalImg,
  },
];

export const ORDER_STATUS_SUMMARY = [
  { key: "belumDitinjau", label: "Belum Ditinjau" },
  { key: "ditolak", label: "Ditolak" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];
