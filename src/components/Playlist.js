import styles from "@/styles/Playlist.module.css";
import { useState } from "react";

import { Search } from "lucide-react";

export default function Playlist({ songs, currentSongIndex, onLoadSong }) {
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
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search by title or artist..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <Search size={20} strokeWidth={3} />
      </div>
      <ul id="playlist" className={styles.playlist}>
        {filteredSongs.map((song) => (
          <li
            key={song.songId}
            className={
              currentSongIndex === song.trackNumber ? styles.playing : ""
            }
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
