import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Slider, IconButton } from "@mui/material";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

const AudioPlayer = ({ audioSrc, onAudioChange }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audioSrc) {
      audio.src = audioSrc; // Обновляем источник аудио
      audio.load(); // Загружаем аудио файл заново

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleError = (event) => {
        console.error("Error loading audio:", event);
        setError(event.message || "Unknown error");
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("error", handleError);
      };
    }
  }, [audioSrc]); // Слежение за изменениями аудио источника

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        setError(err);
        console.error("Error playing audio:", err);
      });
    }
    setPlaying(!playing);
  };

  const handleStop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e, newVolume) => {
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleMuteUnmute = () => {
    setMuted(!muted);
    audioRef.current.muted = !muted;
  };

  const handleTimeChange = (e, newTime) => {
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        padding: 2,
        bgcolor: "#808080",
        borderRadius: 2,
      }}
    >
      <audio ref={audioRef} type="audio/mp3" />
      {error && <Typography color="error">{error.message}</Typography>}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="body2">
          {Math.floor(currentTime / 60)}:
          {Math.floor(currentTime % 60)
            .toString()
            .padStart(2, "0")}
        </Typography>

        <Slider
          value={currentTime}
          min={0}
          max={duration || 0}
          step={0.01}
          onChange={handleTimeChange}
          sx={{ flexGrow: 1, margin: "0 10px" }}
        />

        <Typography variant="body2">
          {Math.floor(duration / 60)}:
          {Math.floor(duration % 60)
            .toString()
            .padStart(2, "0")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton onClick={handlePlayPause}>
          {playing ? (
            <PauseCircleOutlinedIcon fontSize="large" />
          ) : (
            <PlayCircleOutlineOutlinedIcon fontSize="large" />
          )}
        </IconButton>

        <IconButton onClick={handleStop}>
          <StopCircleOutlinedIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={handleMuteUnmute}>
          {muted ? (
            <VolumeOffIcon fontSize="large" />
          ) : (
            <VolumeUpIcon fontSize="large" />
          )}
        </IconButton>

        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolumeChange}
          disabled={muted}
          sx={{ width: 150 }}
        />
      </Box>
    </Box>
  );
};

export default AudioPlayer;
