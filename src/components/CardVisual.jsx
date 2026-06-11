import { useEffect, useRef, useState } from "react";
import { ImageWithPlaceholder, MediaPlaceholder } from "./LoadingPlaceholder";
import {
  markProjectVideoComplete,
  registerProjectVideo,
  updateProjectVideoRatio,
} from "../lib/projectVideoManager";

export function CardVisual({ mock, image, video, title }) {
  return (
    <div className="card-visual">
      <MockPreview type={mock} image={image} video={video} title={title} />
    </div>
  );
}

function VideoPreview({ video, title }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const instanceRef = useRef({
    ratio: 0,
    completed: false,
    play() {
      const videoEl = videoRef.current;
      if (!videoEl || this.completed) return;

      if (videoEl.ended) {
        this.completed = true;
        return;
      }

      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    },
    pause() {
      const videoEl = videoRef.current;
      if (!videoEl || videoEl.paused) return;
      videoEl.pause();
    },
  });

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = videoRef.current;
    const instance = instanceRef.current;
    if (!container || !videoEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const handleEnded = () => {
      markProjectVideoComplete(instance);
    };

    const handleReady = () => setReady(true);

    videoEl.addEventListener("ended", handleEnded);
    videoEl.addEventListener("loadeddata", handleReady);

    if (videoEl.readyState >= 2) {
      setReady(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateProjectVideoRatio(instance, entry.intersectionRatio);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(container);
    const unregister = registerProjectVideo(instance);

    return () => {
      observer.disconnect();
      videoEl.removeEventListener("ended", handleEnded);
      videoEl.removeEventListener("loadeddata", handleReady);
      unregister();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`media-shell mock-video${ready ? " is-loaded" : ""}`}
    >
      <MediaPlaceholder />
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline
        preload="metadata"
        aria-label={`${title} preview`}
      />
    </div>
  );
}

function MockPreview({ type, image, video, title }) {
  if (type === "video" && video) {
    return <VideoPreview video={video} title={title} />;
  }

  if (type === "image" && image) {
    return (
      <div className="visual-mock">
        <ImageWithPlaceholder src={image} alt={`${title} preview`} />
      </div>
    );
  }

  if (type === "placeholder") {
    return (
      <div className="visual-mock mock-placeholder" aria-hidden="true" />
    );
  }

  return null;
}
