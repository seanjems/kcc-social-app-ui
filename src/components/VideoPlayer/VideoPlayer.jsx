import { divide } from "lodash";
import React, { useEffect, useRef, useState } from "react";

function VideoPlayer({
  src,
  classNameProp,
  poster = null,
  parentScrolled,
  muteAudio = false,
  autoPlay = false,
}) {
  const videoPlayerRef = useRef(null);
  const [isFirstPlay, setIsFirstPlay] = useState(true);

  //withouth this gimick, the player calls the endpoint endlessly with un ordered ranges
  function handlePlay() {
    if (isFirstPlay) {
      setTimeout(() => {
        videoPlayerRef.current.pause();
        setTimeout(() => {
          videoPlayerRef.current.play();
        }, 100);
      }, 100);
      setIsFirstPlay(false);
    }
  }

  useEffect(() => {
    handleScroll();
  }, [parentScrolled]);

  function handleScroll() {
    // Get the bounding rectangle of the video element
    const videoRect = videoPlayerRef.current.getBoundingClientRect();

    // Check if the video is in view
    if (
      videoRect.top >= 0 &&
      videoRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    ) {
      // Video is in view, play if paused
      if (videoPlayerRef.current.paused) {
        // videoPlayerRef.current.play();
      }
    } else {
      // Video is out of view, pause if playing
      if (!videoPlayerRef.current.paused) {
        videoPlayerRef.current.pause();
      }
    }
  }
  return (
    <div className="w-100" style={{ borderRadius: "5px", overflow: "clip" }}>
      <video
        ref={videoPlayerRef}
        className={classNameProp}
        width="100%"
        controls
        poster={poster ? poster : ""}
        muted={muteAudio}
        onPlay={handlePlay}
        autoPlay={autoPlay ? autoPlay : false}
      >
        <source src={src} type="video/mp4" preload="metadata" />
      </video>
    </div>
  );
}
export default VideoPlayer;
