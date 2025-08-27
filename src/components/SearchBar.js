import styles from "@/styles/SearchBar.module.css";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder,
  handleSearchChange,
  searchTerm,
  backgroundColor,
}) {
  return (
    <div className={styles.search} style={{ backgroundColor: backgroundColor }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleSearchChange}
        value={searchTerm}
      />
      <Search size={20} strokeWidth={3} />
    </div>
  );
}
