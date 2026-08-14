"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(err => console.log("Audio autoplay prevented:", err));
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full glass-card hover:bg-white/60 transition-all duration-300 shadow-lg group flex items-center justify-center"
        aria-label="Toggle Music"
      >
        <div className="absolute inset-0 rounded-full bg-rose-gold/20 animate-ping opacity-75"></div>
        {isPlaying ? (
          <Pause className="w-6 h-6 text-rose-gold group-hover:scale-110 transition-transform relative z-10" />
        ) : (
          <Play className="w-6 h-6 text-rose-gold group-hover:scale-110 transition-transform relative z-10 ml-1" />
        )}
        <Music className="w-4 h-4 text-rose-gold absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce" />
      </button>
    </>
  );
}
