import { useEffect, useState } from "react";

import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

import styles from "@/styles/Artist.module.css";
import InstagramLogo from "@/components/svgs/InstagramLogo";
import YouTubeLogo from "@/components/svgs/YouTubeLogo";
import SpotifyLogo from "@/components/svgs/SpotifyLogo";

import { Noto_Sans_JP } from "next/font/google";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  display: "swap",
});

import { CirclePlay, CirclePause } from "lucide-react";
import AudioVisualiser from "./svgs/AudioVisualiser";

const ArtistComp = ({ artistData }) => {
  const { loadArtistAlbum, selectedAlbum, isPlaying, songs, togglePlayPause } =
    useMusicPlayer();
  const { session } = useAuth();
  const { openModal } = useModal();

  const [albums, setAlbums] = useState([]);
  const [albumsStatusMessage, setAlbumsStatusMessage] = useState("");

  // Safety check in case the context is used without data
  if (!artistData) return null;

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        const response = await fetch(`/api/albums?artistId=${artistData.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedAlbums = await response.json();

        if (fetchedAlbums.length > 0) {
          setAlbums(fetchedAlbums);
        } else {
          setAlbumsStatusMessage("Music comming soon.");
        }
      } catch (error) {
        console.error("Failed to fetch albums:", error);
        setAlbumsStatusMessage(
          `Error loading albums for ${artistData.id}. Is the backend running?`
        );
      }
    };
    if (session) fetchArtistAlbums();
  }, [session]);

  const useSocialLogo = (socialName) => {
    const SocialLogos = {
      instagram: <InstagramLogo />,
      youtube: <YouTubeLogo />,
      spotify: <SpotifyLogo />,
    };
    return SocialLogos[socialName];
  };

  // NEW: Combined Click Handler for Albums
  const handleAlbumClick = (albumId) => {
    // 1. Check if the clicked album is ALREADY loaded globally
    const isThisAlbumActive = selectedAlbum === albumId;

    if (isThisAlbumActive && songs.length > 0) {
      // 2. If it's active and songs are loaded, simply toggle the global playback state
      togglePlayPause();
    } else {
      // 3. If it's a NEW album (or current one is empty), load the new album.
      // The loadArtistAlbum function (in context) handles fetching and setting isPlaying=true.
      loadArtistAlbum(albumId);
    }
  };
  return (
    <div className={styles.appContainer}>
      <div className={styles.artist}>
        <div>
          <h1 className={styles.artistNameHeader}>{artistData.name}</h1>
          <img
            className={styles.artistImage}
            src={artistData.image}
            alt={artistData.name}
          />
          <ul className={styles.artistSocials}>
            {artistData.socials.map((social, index) => (
              <li key={index}>
                <a href={social.link} target="_blank" rel="noopener noreferrer">
                  {useSocialLogo(social.socialName)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.artistInfoSection}>
          <p>{artistData.shortBio}</p>
          <div className={styles.artistMusic}>
            {session ? (
              <div>
                {albums.length > 0 ? (
                  <ul>
                    {albums.map((album) => (
                      <li
                        key={album.albumId}
                        onClick={() => {
                          handleAlbumClick(album.albumId);
                        }}
                      >
                        {selectedAlbum === album.albumId && isPlaying ? (
                          <CirclePause strokeWidth={1} stroke="#000" />
                        ) : (
                          <CirclePlay strokeWidth={1} stroke="#000" />
                        )}{" "}
                        <span>{album.title}</span>
                        {selectedAlbum === album.albumId && isPlaying ? (
                          <AudioVisualiser width="90" height="15" />
                        ) : (
                          ""
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{albumsStatusMessage}</p>
                )}
              </div>
            ) : (
              <button
                className={notoSansJP.className}
                onClick={() => openModal("signin")}
              >
                Listen exclusively
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistComp;
