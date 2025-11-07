import { useModal } from "@/context/ModalContext";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

import styles from "@/styles/Artists.module.css";
import modalStyles from "@/styles/Modal.module.css";
import InstagramLogo from "@/components/InstagramLogo";
import YouTubeLogo from "@/components/YouTubeLogo";
import SpotifyLogo from "@/components/SpotifyLogo";

const ArtistsModalContent = () => {
  const { artistData, closeArtistModal } = useModal();
  const { loadArtistAlbum } = useMusicPlayer();

  // Safety check in case the context is used without data
  if (!artistData) return null;

  // Helper function from your original component
  const useSocialLogo = (socialName) => {
    const SocialLogos = {
      instagram: <InstagramLogo />,
      youtube: <YouTubeLogo />,
      spotify: <SpotifyLogo />,
    };
    return SocialLogos[socialName];
  };

  // The event handler to close the modal is now a simple function call
  const handleClose = (e) => {
    e.stopPropagation();
    closeArtistModal();
  };

  return (
    <>
      <span className={modalStyles.closeButton} onClick={handleClose}>
        &times;
      </span>
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
    </>
  );
};

export default ArtistsModalContent;
