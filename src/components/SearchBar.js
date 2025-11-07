import styles from "@/styles/SearchBar.module.css";
import { Search } from "lucide-react";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

export default function SearchBar({
  name,
  placeholder,
  handleSearchChange,
  searchTerm,
  backgroundColor,
}) {
  return (
    <div
      className={`${styles.search}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={handleSearchChange}
        value={searchTerm}
        className={`${notoSansJP.className}`}
      />
      <Search size={20} strokeWidth={3} />
    </div>
  );
}
