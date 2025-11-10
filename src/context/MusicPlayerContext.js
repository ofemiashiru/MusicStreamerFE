import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Hls from "hls.js";
import { useAuth } from "@/context/AuthContext";

const MusicPlayerContext = createContext(null);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === null) {
    throw new Error(
      "useMusicPlayer must be used within an MusicPlayerProvider"
    );
  }

  return context;
};

export const MusicPlayerProvider = ({ children }) => {
  const { session } = useAuth();
  const audioPlayer = useRef(null);

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState([]);
  const [songsStatusMessage, setSongsStatusMessage] = useState("");

  const [currentSong, setCurrentSong] = useState(null); // Tracks the currently playing song object
  const [currentSongUrl, setCurrentSongUrl] = useState(null); // Tracks the temporary playable URL

  const fetchSongMetadata = useCallback(async (albumId) => {
    setSongsStatusMessage("Loading songs...");
    try {
      // This endpoint returns song objects with the S3 manifestKey
      const response = await fetch(`/api/songs?albumId=${albumId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedSongs = await response.json();

      if (fetchedSongs.length > 0) {
        setSongs(fetchedSongs);
        setSongsStatusMessage("");
        // DO NOT start playing here. We only have the metadata.
      } else {
        setSongs([]);
        setSongsStatusMessage("No songs found for this album.");
      }
    } catch (error) {
      console.error("Failed to fetch song metadata:", error);
      setSongs([]);
      setSongsStatusMessage("Error loading songs.");
    }
  }, []);

  useEffect(() => {
    if (selectedAlbum && session) {
      fetchSongMetadata(selectedAlbum);
    }
  }, [selectedAlbum, session, fetchSongMetadata]);

  const playSong = useCallback(
    async (song) => {
      if (!session) {
        setSongsStatusMessage("You must be logged in to play music.");
        return;
      }

      const manifestKey = song.manifestKey; // The S3 path from your metadata

      if (!manifestKey) {
        setSongsStatusMessage("Error: Missing manifest key for this song.");
        return;
      }

      setSongsStatusMessage(`Fetching secure URL for ${song.title}...`);
      setCurrentSong(song); // Set the song as currently selected

      try {
        // CALL YOUR NEW API ENDPOINT
        // const response = await fetch(`/api/get-manifest?key=${manifestKey}`);
        const url = `/api/get-manifest?key=${manifestKey}`;

        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        // const { url } = await response.json(); // The temporary Pre-Signed URL

        // This triggers the useEffect below to update the audio player
        setCurrentSongUrl(url);
        setSongsStatusMessage("");
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to fetch signed URL:", error);
        setSongsStatusMessage(
          "Error playing song. Failed to get playback URL."
        );
        setCurrentSongUrl(null);
        setIsPlaying(false);
      }
    },
    [session]
  );

  // --- 3. AUDIO PLAYER SIDE EFFECT ---
  // This effect runs whenever the currentSongUrl changes.
  useEffect(() => {
    const audio = audioPlayer.current;

    if (!currentSongUrl || !audio) return;

    // Cleanup any existing Hls instance or event listeners
    if (audio.hls) {
      audio.hls.destroy();
    }

    // Check if the browser supports HLS natively (like Safari)
    if (
      audio.canPlayType("application/vnd.apple.mpegurl") ||
      Hls.isSupported() === false
    ) {
      // Use native browser playback (works for Safari or direct links)
      audio.pause();
      audio.src = currentSongUrl;
      audio.load();
    } else if (Hls.isSupported()) {
      // 🚨 Use hls.js for adaptive streaming in other browsers 🚨
      const hls = new Hls();
      audio.hls = hls; // Store the instance on the audio element for cleanup/access

      hls.loadSource(currentSongUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          // Now we know the stream is ready to play
          if (isPlaying) {
            audio.play().catch((e) => {
              console.error("Autoplay failed via hls.js:", e);
              setSongsStatusMessage("Playback requires user interaction.");
              setIsPlaying(false);
            });
          }
        });
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          console.error("HLS Fatal Error:", data.details);
          setSongsStatusMessage(
            `Error loading stream: ${data.details}. Is the S3 URL valid?`
          );
        }
      });
    } else {
      setSongsStatusMessage("Your browser does not support HLS playback.");
      return;
    }

    // Cleanup function when the component unmounts or URL changes
    return () => {
      if (audio.hls) {
        audio.hls.destroy();
        audio.hls = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongUrl]);

  const togglePlayPause = () => {
    const audio = audioPlayer.current;
    // if (!audio || songs.length === 0) return; // Safety check
    if (!audio || !currentSongUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const loadArtistAlbum = (albumId) => {
    setSelectedAlbum(albumId);
    setCurrentSong(null); // Reset current song when changing album
    setCurrentSongUrl(null); // Reset URL
    setIsPlaying(false);
  };

  const resetAllMusic = () => {
    setSelectedAlbum(null);
    setCurrentSong(null);
    setCurrentSongUrl(null);
  };

  const contextValue = {
    audioPlayer, //Expose the ref to use on other items within app
    togglePlayPause,
    selectedAlbum,
    songs,
    songsStatusMessage,
    isPlaying,
    setIsPlaying,
    loadArtistAlbum,
    setSelectedAlbum,
    currentSong, // Expose the currently playing song's metadata
    playSong, // New function to start the secure playback process
    resetAllMusic,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
