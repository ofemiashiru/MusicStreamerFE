import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume1,
  Volume2,
} from "lucide-react";

import styles from "@/styles/MusicPlayer.module.css";

import Playlist from "./Playlist";

import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function MusicPlayer() {
  const {
    songs,
    songsStatusMessage,
    isPlaying,
    audioPlayer, // Exposed Ref from Music context
    togglePlayPause,
    playSong,
    currentSong,
    setIsPlaying,
  } = useMusicPlayer();

  // State for the index of the currently playing song
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  // State for the audio player's progress (0-100)
  const [progress, setProgress] = useState(0);
  // State for the current time of the song
  const [currentTime, setCurrentTime] = useState("0:00");
  // State for the total duration of the song
  const [duration, setDuration] = useState("0:00");
  // State for the songVolume Icon
  const [songVolume, setSongVolume] = useState(100);
  const volumeSizeIcon = 24;
  // State for playlist
  const [playlistVisible, setPlaylistVisible] = useState(false);
  // State for music player
  const [musicPlayerVisibile, setMusicPlayerVisible] = useState(false);
  // State for volume player
  const [volumeVisisble, setVolumeVisible] = useState(false);

  // useEffect hook to set up audio player event listeners and load current song
  useEffect(() => {
    const audio = audioPlayer.current;
    if (!audio) return;

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
      if (currentSongIndex < songs.length - 1) {
        handleNext();
      } else {
        // Stop the audio element and explicitly set state to paused
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0; // Reset to beginning
        loadSong(0); // Reset song to first track
        setIsPlaying(false); // Manually set state to paused

        console.log("Playlist finished. Stopped and reset.");
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleSongEnd);

    // Cleanup function to remove event listeners when the component unmounts or dependencies change
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [audioPlayer, songs, currentSongIndex]); // Re-run effect if songs or currentSongIndex changes

  // Function to load a specific song from the playlist
  const loadSong = (index) => {
    if (index >= 0 && index < songs.length) {
      setCurrentSongIndex(index);
      playSong(songs[index]);
      // The useEffect hook will handle loading the new song source and playing it
    }
  };

  // Function to handle playing the next song
  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    loadSong(nextIndex); // This function internally sets isPlaying=true
    console.log("Next song loaded and playing");
  };

  // Function to handle playing the previous song
  const handlePrev = () => {
    if (songs.length > 1) {
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(prevIndex);
      // Play will be handled by useEffect after song source changes
    } else {
      audioPlayer.current.currentTime = 0;
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

  // Player toggle show/hide
  const togglePlayer = () => {
    setMusicPlayerVisible(!musicPlayerVisibile);
    if (!musicPlayerVisibile) {
      setPlaylistVisible(false);
      setVolumeVisible(false);
    }
  };

  // Volume toggle
  const toggleVolume = () => {
    setVolumeVisible(!volumeVisisble);
  };

  const displaySong = currentSong || songs[0];

  useEffect(() => {
    if (!currentSong && songs.length > 0) {
      loadSong(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]); // Load the first song when the song list changes

  return (
    <div
      className={`${styles.main} ${musicPlayerVisibile && styles.closePlayer}`}
    >
      <div className={styles.left}>
        {/* Left Section */}
        <div
          className={
            playlistVisible ? styles.playlistMain : styles.playlistMainHidden
          }
        >
          {/* PlayList Section */}
          <Playlist onLoadSong={loadSong} />
        </div>
        <div className={styles.songinfo}>
          <div className={styles.artwork} onClick={togglePlaylist}>
            <img
              id="album-art"
              src={
                songs.length > 0
                  ? currentSong?.cover
                  : "https://placehold.co/300x300/4B5563/F9FAFB?text=No+Song"
              }
              alt="Album Art"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/300x300/4B5563/F9FAFB?text=No+Song")
              } // Fallback image
            />
          </div>
          <div className={styles.info}>
            <p className="font-bold">{currentSong?.title}</p>
            <p>{currentSong?.artist}</p>
          </div>
        </div>
      </div>
      <div className={styles.middle}>
        {/* Playback Controls */}
        <div className={styles.playback}>
          <button onClick={handlePrev}>
            <SkipBack size={13} strokeWidth={2} />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause size={25} strokeWidth={1} />
            ) : (
              <Play size={25} strokeWidth={1} />
            )}
          </button>
          <button onClick={handleNext}>
            <SkipForward size={13} strokeWidth={2} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <span className={styles.time}>{currentTime}</span>
          <input
            type="range"
            id="progress-bar"
            className={styles.progress}
            value={progress}
            max="100"
            onChange={handleSeek}
          />
          <span className={styles.time}>{duration}</span>
        </div>
        {/* Audio Element */}
        <audio
          ref={audioPlayer}
          src={currentSong?.audio}
          className="hidden"
        ></audio>
      </div>
      <div className={styles.right}>
        <button className={styles.musicplayertoggle} onClick={togglePlayer}>
          {musicPlayerVisibile ? "open" : "close"}
        </button>
        <div
          className={`${styles.volumeInputSection} ${
            volumeVisisble && styles.volumeInputShown
          }`}
        >
          <input
            type="range"
            id="volume-slider"
            className={styles.volumebar}
            defaultValue={songVolume}
            max="100"
            onChange={setVolume}
          />
        </div>
        <div className={styles.volumecontrolwrapper}>
          <button className={styles.volumeButton} onClick={toggleVolume}>
            {songVolume > 60 ? (
              <Volume2
                size={volumeSizeIcon}
                strokeWidth={1}
                className={styles.volumeIcon}
              />
            ) : songVolume == 0 ? (
              <VolumeX
                size={volumeSizeIcon}
                strokeWidth={1}
                className={styles.volumeIcon}
              />
            ) : (
              <Volume1
                size={volumeSizeIcon}
                strokeWidth={1}
                className={styles.volumeIcon}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
