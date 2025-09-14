import styles from "@/styles/NavBar.module.css";
import { useState } from "react";
import { signOut } from "aws-amplify/auth";

export default function NavBar({ session, setSession, doShowModal }) {
  // State to manage the visibility of the mobile menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const groups = session?.tokens?.idToken?.payload["cognito:groups"];
  const ARTIST = "artist";
  const FAN = "fan";

  // Function to toggle the menu state.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to log out
  const LogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      setSession(null);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo or brand name */}
        <a href="/" className={styles.navbarLogo}>
          Artist name
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
          {session ? (
            <li className={styles.navItem}>
              <button onClick={LogOut} className={styles.navLinksBtn}>
                {" "}
                Log out {session?.tokens?.signInDetails?.loginId}
              </button>
            </li>
          ) : (
            <li className={styles.navItem}>
              <button onClick={doShowModal} className={styles.navLinksBtn}>
                Log in
              </button>
            </li>
          )}
          {session && groups.includes(ARTIST) && (
            <li className={styles.navItem}>
              <button onClick={doShowModal} className={styles.navLinksBtn}>
                Admin
              </button>
            </li>
          )}
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
