"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  instagramLink?: string;
}

export default function VideoPlayer({ videoUrl, thumbnail, instagramLink }: VideoPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstagramPrompt, setShowInstagramPrompt] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Lazy load video only when hovered
  useEffect(() => {
    if (!isHovered || !videoRef.current) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().then(() => {
        setIsPlaying(true);

        // After 5 seconds of playing, pause video and show Instagram prompt
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.pause();
            // Keep video visible (frozen frame) but show prompt overlay
          }
          setShowInstagramPrompt(true);
        }, 5000);
      }).catch((err) => {
        console.error("Play failed:", err);
        setHasError(true);
      });
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error("Video failed to load:", videoUrl);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Load the video when hovered
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [isHovered, videoUrl]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowInstagramPrompt(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
    setShowInstagramPrompt(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (instagramLink) {
      window.open(instagramLink, '_blank');
    }
  };

  const handleContainerClick = () => {
    // Only open Instagram if the prompt is showing
    if (showInstagramPrompt && instagramLink) {
      window.open(instagramLink, '_blank');
    }
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
    >
      {/* Thumbnail (shown when not hovering) */}
      {!isHovered && thumbnail && (
        <div className="absolute inset-0 z-10">
          <Image
            src={thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover"
            sizes="255px"
            quality={80}
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
              <Play className="text-black ml-1" size={28} fill="black" />
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner (shown when loading video on hover) */}
      {isLoading && isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-panda-yellow animate-spin" size={32} />
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/20 to-black z-20">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <AlertCircle className="text-red-400" size={32} />
            <span className="text-xs text-gray-400">Video failed to load</span>
          </div>
        </div>
      )}

      {/* Instagram Prompt (shown after 5 seconds of playing) */}
      {showInstagramPrompt && (
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 animate-fade-in cursor-pointer"
          onClick={handleContainerClick}
        >
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center max-w-[200px]">
            <p className="text-base font-bold text-gray-800 mb-3">Watch full video</p>
            <button
              onClick={handleInstagramClick}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg"
            >
              View on Instagram
            </button>
          </div>
        </div>
      )}

      {/* Video Element (LAZY LOADED - only loads on hover) */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnail}
        muted
        playsInline
        preload="none"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          (isPlaying || showInstagramPrompt) && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
