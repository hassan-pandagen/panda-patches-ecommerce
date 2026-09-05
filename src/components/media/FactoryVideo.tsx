"use client";

/**
 * Click-to-play facade for the factory tour (CEO, 2026-09-06).
 *
 * WHY A FACADE AND NOT AN IFRAME. A YouTube embed pulls roughly half a megabyte
 * of third-party JavaScript on page load and inserts a player whose size the
 * browser only learns about once that script runs. On a page whose layout
 * shifts were deliberately fixed on 26 August, dropping a live iframe in is the
 * quickest way to undo that work. Nothing here loads from YouTube until someone
 * asks to watch: before the click it is one lazy image inside a box whose
 * dimensions are known from the first paint.
 *
 * THE BOX IS SIZED IN CSS, NOT BY THE CONTENT. `aspect-[9/16]` on a fixed
 * max-width reserves the exact space the player will occupy, so the swap from
 * image to iframe moves nothing. That is the whole CLS story, and it is why the
 * aspect ratio is hard-coded rather than inferred from the thumbnail — the
 * thumbnail is 16:9 and the video is 9:16, so inferring it would reserve the
 * wrong shape.
 *
 * THE POSTER IS OURS, NOT YOUTUBE'S. YouTube builds a 16:9 thumbnail for a
 * vertical video by centring the frame over a darkened, zoomed copy of itself,
 * so two thirds of that file is padding. The poster here is the same frame cut
 * back to 9:16 and served from our own origin: less than half the bytes, and
 * nothing at all is requested from a third party until the visitor clicks.
 *
 * WITHOUT JAVASCRIPT it degrades to a plain link to the video rather than an
 * empty box.
 */
import { useState } from "react";
import Image from "next/image";
import { FACTORY_VIDEO } from "@/lib/factoryVideo";

interface Props {
  /** Caps the player width. Portrait video gets tall fast, so keep it modest. */
  maxWidth?: string;
  /** Below-the-fold placements should stay lazy; a hero placement can go eager. */
  priority?: boolean;
  className?: string;
}

export default function FactoryVideo({
  maxWidth = "22rem",
  priority = false,
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={className} style={{ maxWidth }}>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: FACTORY_VIDEO.aspect }}
      >
        {playing ? (
          <iframe
            src={`${FACTORY_VIDEO.embedUrl}?autoplay=1&rel=0&playsinline=1`}
            title={FACTORY_VIDEO.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${FACTORY_VIDEO.name}`}
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            <Image
              src={FACTORY_VIDEO.poster}
              alt=""
              fill
              sizes="(max-width: 30rem) 90vw, 22rem"
              priority={priority}
              loading={priority ? undefined : "lazy"}
              className="object-cover"
            />
            {/* Contrast floor for the play control, so it reads on any frame. */}
            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden focusable="false">
                  <path d="M8 5.5v13l11-6.5-11-6.5z" fill="#0B1F0B" />
                </svg>
              </span>
            </span>
            <span className="absolute left-3 right-3 bottom-3 text-left text-white text-[0.8125rem] font-bold leading-snug drop-shadow">
              Inside our factory
              <span className="block font-medium opacity-90">
                {Math.floor(FACTORY_VIDEO.durationSeconds / 60)}:
                {String(FACTORY_VIDEO.durationSeconds % 60).padStart(2, "0")} &middot; embroidery,
                chenille, PVC, laser leather
              </span>
            </span>
          </button>
        )}
      </div>

      <noscript>
        <a
          href={FACTORY_VIDEO.contentUrl}
          className="mt-2 inline-block text-[0.8125rem] font-semibold text-panda-green underline"
        >
          Watch the factory tour on YouTube
        </a>
      </noscript>
    </div>
  );
}
