import styles from "@/styles/Playlist.module.css";

export default function Playlist({ songs, currentSongIndex, onLoadSong }) {
  return (
    <div className={styles.main}>
      <ul id="playlist" className={styles.playlist}>
        {songs.map((song, index) => (
          <li
            key={song.songId || index} // Use songId as key if available, fallback to index
            className={currentSongIndex === index ? styles.playing : ""}
            onClick={() => onLoadSong(index)}
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
