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
        // 1. Construct the internal API URL
        const apiEndpoint = `/api/get-cf-manifest?key=${manifestKey}`;

        // 2. Fetch the data from your secure API endpoint
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          // Handle non-200 responses (e.g., 403 Forbidden, 500 Internal Error)
          throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();

        // 3. Extract the actual CloudFront Signed URL from the response body
        const streamUrl = data.streamUrl;

        if (!streamUrl) {
          throw new Error("API did not return a stream URL.");
        }

        // 4. Set the actual stream URL for the audio player to use
        setCurrentSongUrl(streamUrl);
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

    const isNativelySupported = audio.canPlayType(
      "application/vnd.apple.mpegurl"
    );

    if (isNativelySupported && Hls.isSupported() === false) {
      // SAFARI: Use native playback only if the browser explicitly supports HLS MIME type AND hls.js is not available/supported (or to force native).
      console.log("USING NATIVE HLS PLAYBACK (e.g., Safari)");
      audio.pause();
      audio.src = currentSongUrl;
      audio.load();
    } else if (Hls.isSupported()) {
      // OTHER BROWSERS (Chrome, Firefox, Edge): Use hls.js via MSE
      console.log("USING HLS.JS (e.g., Chrome, Firefox)");
      const hls = new Hls({
        // Optional: Add hls.js config like 'startPosition' if needed
      });
      audio.hls = hls; // Store the instance

      hls.loadSource(currentSongUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // Playback logic moved here, as media is attached and manifest is ready
        if (isPlaying) {
          // A brief timeout can sometimes help avoid race conditions/autoplay issues
          setTimeout(() => {
            audio.play().catch((e) => {
              console.error("Autoplay failed via hls.js:", e);
              // Handle autoplay failure as before
              setSongsStatusMessage("Playback requires user interaction.");
              setIsPlaying(false);
            });
          }, 0);
        }
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          // Attempt to recover from fatal error
          if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
            // Handle network issues etc.
          } else {
            hls.destroy();
            setSongsStatusMessage(
              `Fatal error loading stream: ${data.details}.`
            );
          }
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
