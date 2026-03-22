import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";

export default function VideoPlayer({ lesson, videoTimeRef }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    if (videoTimeRef) videoTimeRef.current = videoRef.current.currentTime;
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: "16/9", maxHeight: "56vh" }}>
      <video
        ref={videoRef}
        key={lesson.videoUrl}
        src={lesson.videoUrl}
        className="w-full h-full object-contain"
        muted={muted}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.3) 100%)" }}>

        {/* Top: lesson title */}
        <div className="px-5 pt-4">
          <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{lesson.title}</p>
        </div>

        {/* Bottom controls */}
        <div className="px-5 pb-4 space-y-2">
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full cursor-pointer group/bar" style={{ background: "rgba(255,255,255,0.2)" }} onClick={seek}>
            <div className="h-full rounded-full relative"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity -translate-x-1/2"
                style={{ boxShadow: "0 0 8px rgba(124,58,237,0.8)" }} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggle}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 14px rgba(124,58,237,0.5)" }}>
                {playing
                  ? <Pause className="w-4 h-4 text-white fill-white" />
                  : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
              </button>
              <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white transition-colors">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                {videoRef.current ? fmt(videoRef.current.currentTime) : "0:00"} / {fmt(duration || 0)}
              </span>
            </div>
            <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white/70 hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center play button (when paused) */}
      {!playing && (
        <button onClick={toggle}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,0.6)" }}>
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}