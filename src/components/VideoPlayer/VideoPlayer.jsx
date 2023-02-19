import React, { useRef, useState } from "react";

function VideoPlayer({ src, classNameProp }) {
  const videoPlayerRef = useRef(null);
  const [isFirstPlay, setIsFirstPlay] = useState(true);

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

  return (
    <video
      ref={videoPlayerRef}
      className={classNameProp}
      width="100%"
      controls
      muted="muted"
      onPlay={handlePlay}
    >
      <source src={src} type="video/mp4" preload="metadata" />
    </video>
  );
}
export default VideoPlayer;
