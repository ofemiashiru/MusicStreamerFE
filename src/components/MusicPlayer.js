import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  Volume2,
} from "lucide-react";

import Playlist from "./Playlist";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);

  // State for the index of the currently playing song
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  // State to track if the music is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  // State for the audio player's progress (0-100)
  const [progress, setProgress] = useState(0);
  // State for the current time of the song
  const [currentTime, setCurrentTime] = useState("0:00");
  // State for the total duration of the song
  const [duration, setDuration] = useState("0:00");
  // State to show loading/error messages
  const [statusMessage, setStatusMessage] = useState("Loading songs...");

  // useRef hook to get a reference to the audio HTML element
  const audioPlayer = useRef();

  // useEffect hook to fetch songs from the backend API when the component mounts
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Fetch data from the local API endpoint (assuming backend is running on same domain/port)
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedSongs = await response.json();

        if (fetchedSongs.length > 0) {
          setSongs(fetchedSongs);
          // Initial load of the first song will happen when `songs` state updates
        } else {
          setStatusMessage("No songs found.");
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setStatusMessage("Error loading songs. Is the backend running?");
      }
    };

    fetchSongs();
  }, []); // Empty dependency array means this effect runs only once on mount

  // useEffect hook to set up audio player event listeners and load current song
  useEffect(() => {
    const audio = audioPlayer.current;
    if (!audio || songs.length === 0) return; // Ensure audio element and songs are available

    // Set the audio source whenever currentSongIndex or songs array changes
    audio.src = songs[currentSongIndex].audio;
    // If already playing, attempt to play the new song immediately
    if (isPlaying) {
      audio.play().catch((e) => console.error("Error playing audio:", e));
    }

    // Listener for when the song's metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    // Listener for updating the progress bar and time display
    const handleTimeUpdate = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
      setCurrentTime(formatTime(audio.currentTime));
    };

    // Listener for when the song ends, automatically plays the next one
    const handleSongEnd = () => {
      handleNext();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleSongEnd);

    // Cleanup function to remove event listeners when the component unmounts or dependencies change
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [songs, currentSongIndex]); // Re-run effect if songs or currentSongIndex changes

  // Function to handle playing/pausing the song
  const togglePlayPause = () => {
    const audio = audioPlayer.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Error playing audio:", e)); // Handle potential play errors
    }
    setIsPlaying(!isPlaying);
  };

  // Function to load a specific song from the playlist
  const loadSong = (index) => {
    if (index >= 0 && index < songs.length) {
      setCurrentSongIndex(index);
      // The useEffect hook will handle loading the new song source and playing it
    }
  };

  // Function to handle playing the next song
  const handleNext = () => {
    if (songs.length > 0) {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      loadSong(nextIndex);
      // Play will be handled by useEffect after song source changes
    }
  };

  // Function to handle playing the previous song
  const handlePrev = () => {
    if (songs.length > 0) {
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(prevIndex);
      // Play will be handled by useEffect after song source changes
    }
  };

  // Function to seek to a new position in the song
  const handleSeek = (e) => {
    const audio = audioPlayer.current;
    if (audio.duration) {
      // Ensure duration is available before seeking
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  // Function to set the volume
  const setVolume = (e) => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = e.target.value / 100;
    }
  };

  // Helper function to format time (e.g., 125 seconds -> 2:05)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainderSeconds < 10 ? `0${remainderSeconds}` : remainderSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // Render loading/error state if no songs are fetched yet
  if (songs.length === 0) {
    return (
      <div className="">
        <p className="">{statusMessage}</p>
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="">
      <div className="">
        {/* Main title and app description */}
        <header className="">
          <h1 className="">My Streaming Service</h1>
        </header>

        <div className="">
          {/* PlayList Section */}
          <Playlist songs={songs} currentSongIndex={currentSongIndex} />

          {/* Music Player Control Section */}
          <div className="">
            <div className="w-full">
              <img
                id="album-art"
                src={currentSong.cover}
                alt="Album Art"
                className=""
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/300x300/4B5563/F9FAFB?text=No+Cover")
                } // Fallback image
              />
              <h3 id="song-title" className="">
                {currentSong.title}
              </h3>
              <p id="artist-name" className="">
                {currentSong.artist}
              </p>
            </div>

            {/* Audio Element */}
            <audio
              ref={audioPlayer}
              src={currentSong.audio}
              className="hidden"
            ></audio>

            {/* Playback Controls */}
            <div className="">
              <button className="" onClick={handlePrev}>
                <SkipBack size={28} className="" />
              </button>
              <button
                className={`${isPlaying ? "bg-indigo-700" : "bg-indigo-600"}`}
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={28} className="" />
                ) : (
                  <Play size={28} className="" />
                )}
              </button>
              <button className="" onClick={handleNext}>
                <SkipForward size={28} className="" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="">
              <div className="">
                <span id="current-time">{currentTime}</span>
                <span id="duration">{duration}</span>
              </div>
              <input
                type="range"
                id="progress-bar"
                className=""
                value={progress}
                max="100"
                onChange={handleSeek}
              />
            </div>

            {/* Volume Control */}
            <div className="">
              <Volume size={20} className="" />
              <input
                type="range"
                id="volume-slider"
                className=""
                defaultValue="50"
                max="100"
                onChange={setVolume}
              />
              <Volume2 size={20} className="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
