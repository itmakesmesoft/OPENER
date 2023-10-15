'use client';
import { useEffect, useState } from 'react';
import styles from './player.module.css';
import YouTube, { YouTubePlayer } from 'react-youtube';
const VideoContainer = (props: {
  playerRef: YouTubePlayer;
  repeat: boolean;
  countDown: number;
  showCountdown: boolean;
  videoUrl: string;
  videoStart: number;
  videoEnd: number;
  addViewCount: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (props.videoUrl !== '-') {
      setMounted(true);
    }
  }, [props.videoUrl]);
  return (
    <div className={styles.videoContainer}>
      {props.showCountdown && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10 bg-[#00000083]">
          <p className="text-8xl t text-white">{props.countDown}</p>
        </div>
      )}
      {mounted && (
        <YouTube
          // className={props.videoUrl === '-' ? 'hidden' : ''}
          onReady={(event) => {
            props.playerRef.current = event.target;
            props.playerRef.current.playVideo();
          }}
          onEnd={() => {
            if (props.repeat)
              props.playerRef.current.seekTo(props.videoStart, true);
            else props.addViewCount();
            props.playerRef.current.playVideo();
          }}
          videoId={props.videoUrl}
          // videoId="jOTfBlKSQYY"
          opts={{
            height: '360',
            width: '640',
            playerVars: {
              loop: 0,
              start: props.videoStart,
              end: props.videoEnd + 1,
              controls: 0, // 컨트롤바(1: 표시, 0: 미표시)
              autoplay: 1, // 자동재생(1: 설정, 0: 취소)
              rel: 0, // 관련 동영상(1: 표시, 0: 미표시)
              modestbranding: 1, // 컨트롤 바 youtube 로고(1: 미표시, 0: 표시)
              iv_load_policy: 3, // 1: 동영상 특수효과 표시, 3: 동영상 특수효과 미표시
            },
          }}
        />
      )}
    </div>
  );
};
export default VideoContainer;
