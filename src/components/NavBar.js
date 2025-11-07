import styles from "@/styles/NavBar.module.css";
import { useState } from "react";
import { signOut } from "aws-amplify/auth";
import Link from "next/link";

import { Noto_Sans_JP } from "next/font/google";
import ManageSubscription from "./ManageSubscription";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function NavBar() {
  // State to manage the visibility of the mobile menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openModal } = useModal();
  const { session, setActiveSession } = useAuth();
  const { resetAllMusic } = useMusicPlayer();

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
    setIsMenuOpen(false);
    try {
      resetAllMusic();
      await signOut();
      setActiveSession(null);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo or brand name */}
        <Link
          href="/"
          className={`${styles.navbarLogo} ${notoSansJP.className}`}
        >
          uv
        </Link>
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
            <Link
              href="/"
              className={styles.navLinks}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/about"
              className={styles.navLinks}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/artists"
              className={styles.navLinks}
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
          </li>
          {/* <li className={styles.navItem}>
            <a href="#" className={styles.navLinks}>
              Store
            </a>
          </li> */}
          {session ? (
            <>
              <li className={styles.navItem}>
                <button
                  onClick={LogOut}
                  className={`${styles.navLinksBtn} ${notoSansJP.className}`}
                >
                  Sign out
                </button>
              </li>
              <li>
                <ManageSubscription session={session} />
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <button
                  onClick={() => {
                    openModal("signin");
                    setIsMenuOpen(false);
                  }}
                  className={`${styles.navLinksBtn} ${notoSansJP.className}`}
                >
                  Sign in
                </button>
              </li>
              <li className={styles.navItem}>
                <button
                  onClick={() => {
                    openModal("register");
                    setIsMenuOpen(false);
                  }}
                  className={`${styles.navLinksBtn} ${notoSansJP.className}`}
                >
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
