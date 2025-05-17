"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaMusic,
} from "react-icons/fa";
import { cn } from "@/app/lib/utils";

// 歌曲列表
const songs = [
  {
    title: "周杰伦《晴天》",
    url: "https://cloudshoping-1318477772.cos.ap-nanjing.myqcloud.com/%E5%91%A8%E6%9D%B0%E4%BC%A6%20-%20%E6%99%B4%E5%A4%A9%281%29.mp3",
  },
  {
    title: "周杰伦《七里香》",
    url: "https://cloudshoping-1318477772.cos.ap-nanjing.myqcloud.com/%E5%91%A8%E6%9D%B0%E4%BC%A6%20-%20%E4%B8%83%E9%87%8C%E9%A6%99.mp3",
  },
  {
    title: "周杰伦《告白气球》",
    url: "https://cloudshoping-1318477772.cos.ap-nanjing.myqcloud.com/%E5%91%A8%E6%9D%B0%E4%BC%A6%20-%20%E5%91%8A%E7%99%BD%E6%B0%94%E7%90%83.mp3",
  },
  {
    title: "小虎队《爱》",
    url: "https://cloudshoping-1318477772.cos.ap-nanjing.myqcloud.com/%E5%B0%8F%E8%99%8E%E9%98%9F%20-%20%E7%88%B1.mp3",
  },
  {
    title: "林俊杰《当你》",
    url: "https://cloudshoping-1318477772.cos.ap-nanjing.myqcloud.com/%E6%9E%97%E4%BF%8A%E6%9D%B0%20-%20%E5%BD%93%E4%BD%A0.mp3",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // 当前歌曲
  const currentSong = songs[currentSongIndex];

  // 播放/暂停
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 切换到下一首
  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setProgress(0);

    // 如果当前正在播放，那么切换后自动播放下一首
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current.play();
      }, 100);
    }
  };

  // 切换到上一首
  const playPrev = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setProgress(0);

    // 如果当前正在播放，那么切换后自动播放上一首
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current.play();
      }, 100);
    }
  };

  // 切换静音
  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 调整音量
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;

    // 如果音量为0，则设置为静音
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  // 更新进度条
  const updateProgress = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
    setDuration(duration);
  };

  // 点击进度条跳转
  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    const width = progressBar.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const percent = clickX / width;

    audioRef.current.currentTime = percent * audioRef.current.duration;
    setProgress(percent * 100);
  };

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 歌曲结束时自动播放下一首
  const handleSongEnd = () => {
    playNext();
  };

  // 切换播放器展开/收起状态
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current;

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [currentSongIndex]);

  // 当组件卸载时暂停音乐
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
        "border border-gray-200 dark:border-gray-700",
        isExpanded ? "w-72" : "w-14 h-14"
      )}
    >
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} src={currentSong.url} preload="metadata" />

      {/* 折叠/展开按钮 */}
      <button
        onClick={toggleExpanded}
        className={cn(
          "absolute top-0 left-0 p-4 text-primary hover:text-primary/80 transition-colors",
          isExpanded ? "hidden" : "flex items-center justify-center w-14 h-14"
        )}
        aria-label={isExpanded ? "收起音乐播放器" : "展开音乐播放器"}
      >
        <FaMusic className="w-5 h-5" />
      </button>

      {/* 展开后的播放器 */}
      {isExpanded && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm truncate pr-2">
              {currentSong.title}
            </h3>
            <button
              onClick={toggleExpanded}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="收起音乐播放器"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* 进度条 */}
          <div
            className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 cursor-pointer"
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* 时间显示 */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* 播放控制 */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={playPrev}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label="上一首"
            >
              <FaBackward className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4" />
              ) : (
                <FaPlay className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label="下一首"
            >
              <FaForward className="w-4 h-4" />
            </button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? (
                <FaVolumeMute className="w-4 h-4" />
              ) : (
                <FaVolumeUp className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
              aria-label="音量"
            />
          </div>
        </div>
      )}
    </div>
  );
}
