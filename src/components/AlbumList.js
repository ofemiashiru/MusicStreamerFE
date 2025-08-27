import { useState } from "react";
import styles from "@/styles/AlbumList.module.css";
import { CirclePlay } from "lucide-react";
import SearchBar from "./SearchBar";

export default function AlbumList({
  albums,
  albumsStatusMessage,
  doFetchSongs,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    // Convert the input value to lowercase for case-insensitive searching.
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAlbums = albums.filter((item) =>
    item.title.toLowerCase().includes(searchTerm)
  );
  return (
    <div className={styles.albums}>
      <SearchBar
        placeholder="Search by title..."
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      {filteredAlbums.length === 0 ? (
        <p>{albumsStatusMessage}</p>
      ) : (
        <ul>
          {filteredAlbums.map((album) => (
            <li
              key={album.albumId}
              className={styles.album}
              onClick={() => doFetchSongs(album.albumId)}
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
                <CirclePlay size={60} strokeWidth={0.5} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
