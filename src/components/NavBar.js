import styles from "@/styles/NavBar.module.css";
import { useState } from "react";

export default function NavBar() {
  // State to manage the visibility of the mobile menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo or brand name */}
        <a href="#" className={styles.navbarLogo}>
          myFi
        </a>
        {/* Burger menu icon for mobile */}
        <div className={styles.menuIcon} onClick={toggleMenu}>
          {/* Use Unicode characters for the burger icon */}
          {isMenuOpen ? "✕" : "☰"}
        </div>
        {/* Navigation links. The "active" class is applied when the menu is open */}
        <ul
          className={`${styles.navMenu} ${
            isMenuOpen ? styles.navMenuShown : ""
          }`}
        >
          <li className={styles.navItem}>
            <a href="#" className={styles.navLinks}>
              Home
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLinks}>
              Admin
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLinks}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
