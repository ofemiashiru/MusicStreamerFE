import SearchBar from "./SearchBar";
import styles from "@/styles/Playlist.module.css";
import { useState } from "react";

import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function Playlist({ onLoadSong }) {
  const { songs, currentSong } = useMusicPlayer();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    // Convert the input value to lowercase for case-insensitive searching.
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredSongs = songs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.artist.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.main}>
      <SearchBar
        name="track"
        placeholder="Track by title or artist..."
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        backgroundColor="rgb(0 0 0 / var(--opacity-80, 1))"
      />
      <ul id="playlist" className={styles.playlist}>
        {filteredSongs.map((song, index) => (
          <li
            key={song.songId}
            className={currentSong?.trackNumber === index ? styles.playing : ""}
            onClick={() => onLoadSong(song.trackNumber)}
          >
            <div className={styles.song}>
              <div className={styles.coverBorder}>
                <img
                  src={song.cover}
                  alt="Album Art"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/100x100/4B5563/F9FAFB?text=No+Cover")
                  } // Fallback image
                />
              </div>
              <div className={styles.songDetails}>
                <p className={styles.title}>{song.title}</p>
                <p className={styles.artist}>{song.artist}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
