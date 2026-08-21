"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";

export interface NextLessonInfo {
  id: string;
  lessonNumber: number;
  title: string;
  duration?: string;
}

export interface DiplomaPlayerProps {
  lessonId: string;
  videoUrl: string;
  title?: string;
  posterUrl?: string;
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  initialTime?: number;
  autoPlay?: boolean;
  nextLesson?: NextLessonInfo | null;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onCompleted?: () => void;
  onNextLesson?: () => void;
  onTheaterToggle?: (isTheater: boolean) => void;
  className?: string;
}

export default function DiplomaPlayer({
  lessonId,
  videoUrl,
  title,
  posterUrl,
  studentName,
  studentEmail,
  studentId,
  initialTime = 0,
  autoPlay = false,
  nextLesson,
  onTimeUpdate,
  onCompleted,
  onNextLesson,
  onTheaterToggle,
  className = "",
}: DiplomaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextLessonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [centerFeedback, setCenterFeedback] = useState<{ icon: string; label: string } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quality levels (HLS)
  const [qualities, setQualities] = useState<{ index: number; label: string; height: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 is Auto

  // Next lesson countdown overlay
  const [countdown, setCountdown] = useState<number | null>(null);

  // Dynamic Anti-Piracy Watermark position (0 to 5)
  const [watermarkPosIdx, setWatermarkPosIdx] = useState<number>(0);

  // Format time (hh:mm:ss or mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Trigger brief center screen visual feedback on keyboard shortcut / action
  const triggerFeedback = useCallback((icon: string, label: string) => {
    setCenterFeedback({ icon, label });
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      setCenterFeedback(null);
    }, 650);
  }, []);

  // Watermark drifting position timer (drifts every 12 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPosIdx((prev) => (prev + 1) % 6);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Watermark positions classes
  const watermarkPositions = [
    "top-6 left-6 text-left",
    "top-6 right-6 text-right",
    "top-1/3 right-10 text-right",
    "bottom-20 right-8 text-right",
    "bottom-20 left-8 text-left",
    "top-1/3 left-10 text-left",
  ];

  // Initialize Video & Hls.js
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setIsLoading(true);
    setCountdown(null);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsStream = videoUrl.includes(".m3u8");

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 60,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const levelQualities = data.levels.map((lvl, index) => ({
          index,
          label: lvl.height ? `${lvl.height}p` : `Level ${index + 1}`,
          height: lvl.height || 0,
        }));
        setQualities(levelQualities);

        // Restore saved playback position
        const savedPos = localStorage.getItem(`timevally_pos_${lessonId}`);
        const seekTarget = initialTime || (savedPos ? parseFloat(savedPos) : 0);
        if (seekTarget > 0 && seekTarget < (video.duration || 9999)) {
          video.currentTime = seekTarget;
        }

        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl") || !isHlsStream) {
      // Native HLS (Safari/iOS) or standard MP4/WebM
      video.src = videoUrl;
      video.load();

      const onLoadedMetadata = () => {
        setIsLoading(false);
        const savedPos = localStorage.getItem(`timevally_pos_${lessonId}`);
        const seekTarget = initialTime || (savedPos ? parseFloat(savedPos) : 0);
        if (seekTarget > 0 && seekTarget < video.duration) {
          video.currentTime = seekTarget;
        }
        if (autoPlay) {
          video.play().catch(() => {});
        }
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, lessonId, initialTime, autoPlay]);

  // Video Event Handlers
  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
      triggerFeedback("fa-play", "Play");
    } else {
      video.pause();
      setIsPlaying(false);
      triggerFeedback("fa-pause", "Pause");
    }
  }, [triggerFeedback]);

  const handleSeek = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const target = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
      video.currentTime = target;
      setCurrentTime(target);
      triggerFeedback(
        seconds > 0 ? "fa-forward" : "fa-backward",
        `${seconds > 0 ? "+" : ""}${seconds}s`
      );
    },
    [triggerFeedback]
  );

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const scrubber = scrubberRef.current;
    if (!video || !scrubber || !duration) return;

    const rect = scrubber.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = pos * duration;
    video.currentTime = target;
    setCurrentTime(target);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const scrubber = scrubberRef.current;
    if (!scrubber || !duration) return;

    const rect = scrubber.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleScrubberMouseLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeChange = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    video.volume = clamped;
    video.muted = clamped === 0;
    setVolume(clamped);
    setIsMuted(clamped === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      if (volume === 0) {
        video.volume = 0.5;
        setVolume(0.5);
      }
      triggerFeedback("fa-volume-high", "Unmuted");
    } else {
      video.muted = true;
      setIsMuted(true);
      triggerFeedback("fa-volume-xmark", "Muted");
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    triggerFeedback("fa-gauge-high", `${rate}x Speed`);
  };

  const changeQuality = (levelIndex: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = levelIndex;
    setCurrentQuality(levelIndex);
    setShowQualityMenu(false);
    const label = levelIndex === -1 ? "Auto Quality" : qualities[levelIndex]?.label || "Custom";
    triggerFeedback("fa-sliders", label);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleTheaterMode = () => {
    const nextState = !isTheaterMode;
    setIsTheaterMode(nextState);
    if (onTheaterToggle) {
      onTheaterToggle(nextState);
    }
    triggerFeedback("fa-expand", nextState ? "Theater Mode" : "Standard View");
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP Error:", e);
    }
  };

  // Video element event listeners
  const onTimeUpdateHandler = () => {
    const video = videoRef.current;
    if (!video) return;
    const cur = video.currentTime;
    const dur = video.duration || 0;

    setCurrentTime(cur);
    setDuration(dur);

    // Update buffered
    if (video.buffered.length > 0) {
      try {
        const bufEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered(dur > 0 ? (bufEnd / dur) * 100 : 0);
      } catch {}
    }

    // Persist position in localStorage
    if (cur > 2) {
      localStorage.setItem(`timevally_pos_${lessonId}`, cur.toString());
    }

    if (onTimeUpdate) {
      onTimeUpdate(cur, dur);
    }
  };

  const onEndedHandler = () => {
    setIsPlaying(false);
    if (onCompleted) {
      onCompleted();
    }

    // Trigger next lesson countdown if available
    if (nextLesson && onNextLesson) {
      setCountdown(5);
    }
  };

  // Countdown timer for next lesson
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      if (onNextLesson) onNextLesson();
      return;
    }

    nextLessonTimerRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (nextLessonTimerRef.current) clearTimeout(nextLessonTimerRef.current);
    };
  }, [countdown, onNextLesson]);

  const cancelNextLessonCountdown = () => {
    if (nextLessonTimerRef.current) clearTimeout(nextLessonTimerRef.current);
    setCountdown(null);
  };

  // Auto-hide controls during playback
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSpeedMenu && !showQualityMenu && !showShortcutsModal) {
          setIsControlsVisible(false);
        }
      }, 3000);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          handlePlayPause();
          break;
        case "arrowleft":
          e.preventDefault();
          handleSeek(-5);
          break;
        case "arrowright":
          e.preventDefault();
          handleSeek(5);
          break;
        case "j":
          e.preventDefault();
          handleSeek(-10);
          break;
        case "l":
          e.preventDefault();
          handleSeek(10);
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          triggerFeedback("fa-volume-high", `Volume ${Math.round(Math.min(1, volume + 0.1) * 100)}%`);
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          triggerFeedback("fa-volume-low", `Volume ${Math.round(Math.max(0, volume - 0.1) * 100)}%`);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          toggleTheaterMode();
          break;
        case "?":
          e.preventDefault();
          setShowShortcutsModal((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, handleSeek, volume, isTheaterMode]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
      className={`relative group select-none bg-black overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 font-sans ${
        isTheaterMode ? "w-full aspect-21/9 max-h-[80vh]" : "w-full aspect-video"
      } ${className}`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        poster={posterUrl}
        playsInline
        onClick={handlePlayPause}
        onDoubleClick={toggleFullscreen}
        onTimeUpdate={onTimeUpdateHandler}
        onEnded={onEndedHandler}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Dynamic Student Anti-Piracy Watermark */}
      <div
        className={`absolute pointer-events-none transition-all duration-1000 z-20 opacity-30 select-none ${
          watermarkPositions[watermarkPosIdx]
        }`}
      >
        <div className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 text-[10px] text-white/80 font-mono tracking-wider shadow-sm flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1 font-bold text-[#14b8a6]">
            <i className="fa-solid fa-shield-halved text-[9px]"></i>
            <span>{studentName || "TimeValley Student"}</span>
          </div>
          <div className="text-white/60 text-[9px]">
            {studentEmail || "Enrolled Student"} {studentId ? `• ID: ${studentId.slice(0, 8)}` : ""}
          </div>
        </div>
      </div>

      {/* Loading & Buffering Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#0E6875] animate-spin shadow-lg"></div>
            <span className="text-xs font-bold text-white tracking-widest uppercase animate-pulse">
              Buffering Stream...
            </span>
          </div>
        </div>
      )}

      {/* Center Feedback Icon on Key Press */}
      {centerFeedback && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-75 duration-200">
          <div className="bg-black/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-white flex flex-col items-center gap-2 shadow-2xl">
            <i className={`fa-solid ${centerFeedback.icon} text-3xl text-[#0E6875]`}></i>
            <span className="text-xs font-black tracking-wide">{centerFeedback.label}</span>
          </div>
        </div>
      )}

      {/* Next Lesson Autoplay Countdown Overlay */}
      {countdown !== null && nextLesson && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-[#1C2B2D]/90 border border-white/15 rounded-3xl p-6 text-center text-white space-y-4 shadow-2xl">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#0E6875"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="175"
                  strokeDashoffset={175 - (175 * (5 - countdown)) / 5}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute text-xl font-black text-white">{countdown}</span>
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#14b8a6]">
                Up Next • Lesson {nextLesson.lessonNumber}
              </span>
              <h3 className="text-base font-black text-white mt-1 line-clamp-2">
                {nextLesson.title}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={cancelNextLessonCountdown}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setCountdown(null);
                  if (onNextLesson) onNextLesson();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold shadow-lg shadow-[#0E6875]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-play text-[10px]"></i>
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Big Play Button Overlay when Paused */}
      {!isPlaying && !isLoading && countdown === null && (
        <button
          type="button"
          onClick={handlePlayPause}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer group/bigplay"
          title="Play Video"
        >
          <div className="w-20 h-20 rounded-full bg-[#0E6875]/90 group-hover/bigplay:bg-[#0E6875] group-hover/bigplay:scale-110 text-white flex items-center justify-center text-2xl shadow-2xl shadow-[#0E6875]/50 transition-all duration-300 border border-white/20">
            <i className="fa-solid fa-play ml-1"></i>
          </div>
        </button>
      )}

      {/* Top Bar (Title & Quick Actions) */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 bg-linear-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse shrink-0"></div>
            <h4 className="text-xs sm:text-sm font-bold truncate tracking-wide text-white/90 drop-shadow-md">
              {title || "TimeValley Venture Architect Masterclass"}
            </h4>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Keyboard Shortcuts Trigger */}
            <button
              type="button"
              onClick={() => setShowShortcutsModal((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs transition-all cursor-pointer"
              title="Keyboard Shortcuts (?)"
            >
              <i className="fa-solid fa-keyboard"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 pt-10 pb-3 px-4 bg-linear-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Progress Bar */}
        <div
          ref={scrubberRef}
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={handleScrubberMouseLeave}
          className="relative group/scrubber h-2 hover:h-3.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-all duration-200 mb-3"
        >
          {/* Buffered Track */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-white/30 rounded-full transition-all duration-150"
            style={{ width: `${buffered}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-8 -translate-x-1/2 bg-black/90 border border-white/20 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Played Track */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#0E6875] group-hover/scrubber:bg-[#14b8a6] rounded-full transition-all duration-75 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber Thumb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/scrubber:scale-100 transition-transform border border-[#0E6875]"></div>
          </div>
        </div>

        {/* Lower Controls Row */}
        <div className="flex items-center justify-between gap-2 text-white">
          {/* Left Controls (Play, Skip, Volume, Time) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-lg hover:bg-white/15 text-white flex items-center justify-center text-sm transition-all cursor-pointer active:scale-90"
              title={isPlaying ? "Pause (k/Space)" : "Play (k/Space)"}
            >
              <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>

            {/* Skip Backward 10s */}
            <button
              type="button"
              onClick={() => handleSeek(-10)}
              className="w-8 h-8 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90"
              title="Rewind 10s (j)"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>

            {/* Skip Forward 10s */}
            <button
              type="button"
              onClick={() => handleSeek(10)}
              className="w-8 h-8 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90"
              title="Forward 10s (l)"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-1 group/vol relative">
              <button
                type="button"
                onClick={toggleMute}
                className="w-8 h-8 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                title={isMuted ? "Unmute (m)" : "Mute (m)"}
              >
                <i
                  className={`fa-solid ${
                    isMuted || volume === 0
                      ? "fa-volume-xmark text-rose-400"
                      : volume > 0.5
                      ? "fa-volume-high"
                      : "fa-volume-low"
                  }`}
                ></i>
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-18 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#0E6875] opacity-80 hover:opacity-100 transition-opacity"
                title="Volume Slider"
              />
            </div>

            {/* Time Stamp Display */}
            <div className="text-[11px] font-mono text-white/80 pl-1">
              <span className="font-bold text-white">{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls (Speed, Quality, PiP, Theater, Fullscreen) */}
          <div className="flex items-center gap-1 sm:gap-2 relative">
            {/* Speed Selector Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSpeedMenu((prev) => !prev);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-1 rounded-lg hover:bg-white/15 text-[11px] font-bold text-white/90 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                title="Playback Speed"
              >
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 bg-[#1C2B2D]/95 backdrop-blur-md border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 min-w-25 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="text-[9px] font-black uppercase text-gray-400 px-2 py-1 tracking-wider border-b border-white/10">
                    Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changePlaybackRate(rate)}
                      className={`text-left px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        playbackRate === rate
                          ? "bg-[#0E6875] text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{rate === 1 ? "Normal" : `${rate}x`}</span>
                      {playbackRate === rate && <i className="fa-solid fa-check text-[10px]"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector Menu (HLS) */}
            {qualities.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowQualityMenu((prev) => !prev);
                    setShowSpeedMenu(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/15 text-white/80 hover:text-white text-xs transition-all cursor-pointer"
                  title="Stream Quality"
                >
                  <i className="fa-solid fa-gear"></i>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-10 right-0 bg-[#1C2B2D]/95 backdrop-blur-md border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 min-w-30 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="text-[9px] font-black uppercase text-gray-400 px-2 py-1 tracking-wider border-b border-white/10">
                      Quality
                    </div>
                    <button
                      type="button"
                      onClick={() => changeQuality(-1)}
                      className={`text-left px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        currentQuality === -1
                          ? "bg-[#0E6875] text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>Auto</span>
                      {currentQuality === -1 && <i className="fa-solid fa-check text-[10px]"></i>}
                    </button>
                    {qualities.map((q) => (
                      <button
                        key={q.index}
                        type="button"
                        onClick={() => changeQuality(q.index)}
                        className={`text-left px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          currentQuality === q.index
                            ? "bg-[#0E6875] text-white"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{q.label}</span>
                        {currentQuality === q.index && (
                          <i className="fa-solid fa-check text-[10px]"></i>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Picture in Picture */}
            <button
              type="button"
              onClick={togglePiP}
              className="p-2 rounded-lg hover:bg-white/15 text-white/80 hover:text-white text-xs transition-all cursor-pointer hidden sm:flex items-center justify-center"
              title="Picture in Picture"
            >
              <i className="fa-solid fa-clone"></i>
            </button>

            {/* Theater Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheaterMode}
              className={`p-2 rounded-lg hover:bg-white/15 text-xs transition-all cursor-pointer hidden md:flex items-center justify-center ${
                isTheaterMode ? "text-[#14b8a6]" : "text-white/80 hover:text-white"
              }`}
              title="Theater Mode (t)"
            >
              <i className="fa-solid fa-table-cells-large"></i>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/15 text-white/80 hover:text-white text-xs transition-all cursor-pointer flex items-center justify-center"
              title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
            >
              <i className={`fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Helper Modal */}
      {showShortcutsModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#1C2B2D] border border-white/20 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-keyboard text-[#0E6875] text-lg"></i>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Play / Pause</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  Space / K
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Seek +/- 5s</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  ← / →
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Seek +/- 10s</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  J / L
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Volume</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  ↑ / ↓
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Mute / Unmute</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  M
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Fullscreen</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  F
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Theater Mode</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  T
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-300 font-medium">Help Menu</span>
                <kbd className="px-2 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-[10px] font-bold text-[#14b8a6]">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
