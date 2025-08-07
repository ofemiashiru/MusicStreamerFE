export default function Playlist({ songs, currentSongIndex }) {
  return (
    <div className="">
      <h2 className="">Playlist</h2>
      <ul id="playlist" className="">
        {songs.map((song, index) => (
          <li
            key={song.songId || index} // Use songId as key if available, fallback to index
            className={`${
              currentSongIndex === index
                ? "bg-indigo-700 ring-2 ring-indigo-500"
                : ""
            }`}
            onClick={() => loadSong(index)}
          >
            <div className="flex-shrink-0">
              <img
                src={song.cover}
                alt="Album Art"
                className=""
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/100x100/4B5563/F9FAFB?text=No+Cover")
                } // Fallback image
              />
            </div>
            <div className="">
              <p className="">{song.title}</p>
              <p className="">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
