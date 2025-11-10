import { useState } from "react";
import styles from "@/styles/AlbumList.module.css";
import { CirclePlay, CirclePause } from "lucide-react";
import SearchBar from "./SearchBar";

import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function AlbumList({ albums, albumsStatusMessage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAlbumVisible, setSearchAlbumVisible] = useState(false);

  const { loadArtistAlbum, selectedAlbum, isPlaying, togglePlayPause, songs } =
    useMusicPlayer();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAlbums = albums.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.artist.toLowerCase().includes(searchTerm)
  );

  // Show / hide album list
  const toggleSearch = () => {
    setSearchAlbumVisible(!searchAlbumVisible);
  };

  const handleAlbumClick = (albumId) => {
    const isThisAlbumActive = selectedAlbum === albumId;

    if (isThisAlbumActive && songs.length > 0) {
      // If the user clicks the currently active album, TOGGLE global playback
      togglePlayPause();
    } else {
      // If the user clicks a NEW album, LOAD it (Context handles fetch/play state)
      loadArtistAlbum(albumId);
    }
  };
  return (
    <div
      className={`${styles.albums} ${
        searchAlbumVisible && styles.albumsClosed
      }`}
    >
      <SearchBar
        name="album"
        placeholder="Album by title or artist..."
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        backgroundColor="rgb(0 0 0 / var(--opacity-80, 1))"
      />
      {filteredAlbums.length === 0 ? (
        <p>{albumsStatusMessage}</p>
      ) : (
        <>
          <ul>
            {filteredAlbums.map((album) => (
              <li
                key={album.albumId}
                className={styles.album}
                onClick={() => {
                  handleAlbumClick(album.albumId);
                }}
              >
                <div className={styles.albumart}>
                  <img
                    src={album.cover}
                    alt="Album Art"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/100x100/4B5563/F9FAFB?text=No+Cover")
                    } // Fallback image
                  />
                </div>
                <div className={styles.albuminfo}>
                  <p>{album.title}</p>
                  <p>{album.artist}</p>
                </div>
                <div className={styles.icon}>
                  {selectedAlbum === album.albumId &&
                    // Show Pause if playing, Play if paused
                    (isPlaying ? (
                      <CirclePause size={60} strokeWidth={0.5} />
                    ) : (
                      <CirclePlay size={60} strokeWidth={0.5} />
                    ))}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={toggleSearch} className={styles.albumlisttoggle}>
            {searchAlbumVisible ? "open" : "close"}
          </button>
        </>
      )}
    </div>
  );
}
