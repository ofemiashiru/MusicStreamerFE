import { useEffect, useState } from "react";

import NavBar from "@/components/NavBar";
import MusicPlayer from "@/components/MusicPlayer";
import AlbumList from "@/components/AlbumList";
import SignIn from "@/components/SignIn";
import Register from "@/components/Register";

import "@/styles/globals.css";
import homeStyles from "@/styles/Home.module.css";
import modalStyles from "@/styles/Modal.module.css";
import StripeLogo from "@/components/StripeLogo";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

import InstagramLogo from "@/components/InstagramLogo";

import { Amplify } from "aws-amplify";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import config from "../amplifyconfiguration.json";

import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

import { ModalProvider, useModal } from "@/context/ModalContext";

import { AuthProvider, useAuth } from "@/context/AuthContext";

Amplify.configure(config);

function AppContent({ Component, pageProps }) {
  const [albums, setAlbums] = useState([]);
  const [albumsStatusMessage, setAlbumsStatusMessage] =
    useState("Loading albums...");

  const { selectedModalType, closeModal } = useModal();
  const { session, setActiveSession } = useAuth();

  const canShowModal = selectedModalType && !session;

  const modalTypeSelecter = () => {
    const modals = {
      signin: <SignIn />,
      register: <Register />,
    };

    return modals[selectedModalType];
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/albums");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedAlbums = await response.json();
        if (fetchedAlbums.length > 0) {
          setAlbums(fetchedAlbums);
        } else {
          setAlbumsStatusMessage("No albums found.");
        }
      } catch (error) {
        console.error("Failed to fetch albums:", error);
        setAlbumsStatusMessage("Error loading albums. Is the backend running?");
      }
    };
    if (session) fetchAlbums();
  }, [session]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const authSession = await fetchAuthSession({ forceRefresh: true });
        if (authSession) {
          setActiveSession(authSession);
        } else {
          try {
            await signOut({ global: true });
            setActiveSession(null);
          } catch (error) {
            console.log("error signing out: ", error);
          }
        }
      } catch (error) {
        // Handle no session found or other errors
        setActiveSession(null);
        console.log("Error fetching auth session:", error);
      }
    };
    restoreSession();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(modalStyles.modalOverlay)) {
      closeModal();
    }
  };

  return (
    <div className={`${notoSansJP.className} `}>
      <NavBar />
      {/* Changes based on clicked link in NavBar */}
      <Component {...pageProps} />

      {/* Persistant Music player and modal */}
      <footer className={homeStyles.footer}>
        <p>&copy; 2025 Unequivocal, Ltd.</p>
        <p className={homeStyles.socials}>
          <a href="https://www.instagram.com/unequivocalmusic/" target="_blank">
            <InstagramLogo />
          </a>
        </p>
      </footer>

      {/* Album list Search */}
      {session && (
        <AlbumList albums={albums} albumsStatusMessage={albumsStatusMessage} />
      )}

      {/* Login and Sign up in Modal */}
      {canShowModal && (
        <div className={modalStyles.modalOverlay} onClick={handleOverlayClick}>
          <div className={modalStyles.modalContent}>
            <span className={modalStyles.closeButton} onClick={closeModal}>
              &times;
            </span>
            {!session && modalTypeSelecter()}
            <div className={modalStyles.poweredby}>
              Powered by <StripeLogo />
            </div>
          </div>
        </div>
      )}
      {/* Music Player */}
      {session && <MusicPlayer />}
    </div>
  );
}

// Export the default function wrapped in the context provider
export default function App(props) {
  return (
    <AuthProvider>
      <ModalProvider>
        <MusicPlayerProvider>
          <AppContent {...props} />
        </MusicPlayerProvider>
      </ModalProvider>
    </AuthProvider>
  );
}
