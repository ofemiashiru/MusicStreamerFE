import styles from "@/styles/AlbumList.module.css";

export default function AlbumList({
  albums,
  albumsStatusMessage,
  doFetchSongs,
}) {
  return (
    <div className={styles.albums}>
      <h1>Albums</h1>
      {albums.length === 0 ? (
        <p>{albumsStatusMessage}</p>
      ) : (
        <ul>
          {albums.map((album) => (
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
