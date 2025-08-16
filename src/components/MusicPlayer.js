import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume1,
  Volume2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import styles from "@/styles/MusicPlayer.module.css";

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
  // State for the songVolume Icon
  const [songVolume, setSongVolume] = useState(50);
  const volumeSizeIcon = 18;
  // State for playlist
  const [playlistVisible, setPlaylistVisible] = useState(false);

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
      const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
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
    setSongVolume(e.target.value);
  };

  // Function to show playlist
  const togglePlaylist = () => {
    setPlaylistVisible(!playlistVisible);
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
      <div>
        <p>{statusMessage}</p>
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        {/* Left Section */}
        <div
          className={
            playlistVisible ? styles.playlistMain : styles.playlistMainHidden
          }
        >
          {/* PlayList Section */}
          <Playlist
            songs={songs}
            currentSongIndex={currentSongIndex}
            onLoadSong={loadSong}
          />
        </div>
        <div className={styles.artwork} onClick={togglePlaylist}>
          {playlistVisible ? (
            <ArrowDown size={20} className={styles.arrowIcon} />
          ) : (
            <ArrowUp size={20} className={styles.arrowIcon} />
          )}
          <img
            id="album-art"
            src={currentSong.cover}
            alt="Album Art"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/300x300/4B5563/F9FAFB?text=No+Cover")
            } // Fallback image
          />
        </div>
      </div>
      <div className={styles.middle}>
        <h3 id="song-title" className={styles.song}>
          {currentSong.title} <span>by {currentSong.artist}</span>
        </h3>
        {/* Playback Controls */}
        <div className={styles.playback}>
          <button onClick={handlePrev}>
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </button>
          <button onClick={handleNext}>
            <SkipForward size={20} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <span>{currentTime}</span>
          <input
            type="range"
            id="progress-bar"
            className={styles.progress}
            value={progress}
            max="100"
            onChange={handleSeek}
          />
          <span>{duration}</span>
        </div>
        {/* Audio Element */}
        <audio
          ref={audioPlayer}
          src={currentSong.audio}
          className="hidden"
        ></audio>
      </div>
      <div className={styles.right}>
        <div className={styles.volumeContainer}>
          {songVolume > 60 ? (
            <Volume2 size={volumeSizeIcon} className={styles.volumeIcon} />
          ) : songVolume == 0 ? (
            <VolumeX size={volumeSizeIcon} className={styles.volumeIcon} />
          ) : (
            <Volume1 size={volumeSizeIcon} className={styles.volumeIcon} />
          )}

          <input
            type="range"
            id="volume-slider"
            defaultValue={songVolume}
            max="100"
            onChange={setVolume}
          />
        </div>
      </div>
    </div>
  );
}
