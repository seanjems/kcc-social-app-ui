import React, { useEffect, useRef, useState } from "react";

function VideoPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const [mediaSourceReady, setMediaSourceReady] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchOffset, setFetchOffset] = useState(0);
  const [chunkSize, setChunkSize] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    video.src = window.URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", () => {
      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      );
      sourceBuffer.mode = "sequence";
      sourceBuffer.addEventListener("updateend", () => {
        if (!fetching) {
          if (video.buffered.length > 0) {
            const bufferedTime = video.buffered.end(0) - video.currentTime;

            if (bufferedTime < 60) {
              // Fetch the next chunk when the buffered video is less than 1 minute
              fetchNextChunk();
            } else if (bufferedTime > 90) {
              // Pause fetching when the buffered video is more than 1.5 minutes
              setFetching(false);
            }
          } else {
            fetchNextChunk();
          }
        }
      });

      setMediaSourceReady(true);
    });

    return () => {
      mediaSourceRef.current = null;
      video.src = "";
    };
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;

    function handlePlay() {
      if (!fetching) {
        if (video.buffered.length > 0) {
          const bufferedTime = video.buffered.end(0) - video.currentTime;

          if (bufferedTime < 60) {
            // Fetch the next chunk when the buffered video is less than 1 minute
            fetchNextChunk();
          } else if (bufferedTime > 90) {
            // Pause fetching when the buffered video is more than 1.5 minutes
            setFetching(false);
          }
        } else {
          fetchNextChunk();
        }
      }
    }

    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    function handleTimeUpdate() {
      if (video.buffered.length > 0) {
        const bufferedTime = video.buffered.end(0) - video.currentTime;

        if (bufferedTime < 60) {
          // Fetch the next chunk when the buffered video is less than 1 minute
          fetchNextChunk();
        } else if (bufferedTime > 90) {
          // Pause fetching when the buffered video is more than 1.5 minutes
          setFetching(false);
        }
      }
    }

    const intervalId = setInterval(handleTimeUpdate, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function fetchNextChunk() {
    setFetching(true);

    fetch(videoUrl, {
      headers: {
        Range: `bytes=${fetchOffset}-`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.arrayBuffer().then((buffer) => {
            const mediaSource = mediaSourceRef.current;
            const sourceBuffer = mediaSource.sourceBuffers[0];

            sourceBuffer.appendBuffer(buffer);
            console.log(
              "🚀 ~ file: VideoPlayer.jsx:98 ~ response.arrayBuffer ~ buffer",
              buffer
            );

            setFetchOffset(fetchOffset + buffer.byteLength);
            setFetching(false);
          });
        } else {
          mediaSourceRef.current.endOfStream();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <video ref={videoRef} controls />

      {!mediaSourceReady && <p>Loading video...</p>}
    </div>
  );
}

export default VideoPlayer;
