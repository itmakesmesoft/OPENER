'use client';

import { useEffect, useState } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { stateType } from '@/types/share';

const VideoContainer = (props: {
  count: number;
  state: stateType;
  playerRef: YouTubePlayer;
  addViewCount: () => void;
  callbackRef: any;
}) => {
  const [mounted, setMounted] = useState(false);

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      loop: 0,
      start: props.state.videoStart,
      end: props.state.videoEnd + 1,
      controls: 1, // 컨트롤바(1: 표시, 0: 미표시)
      autoplay: 1, // 자동재생(1: 설정, 0: 취소)
      rel: 0, // 관련 동영상(1: 표시, 0: 미표시)
      modestbranding: 1, // 컨트롤 바 youtube 로고(1: 미표시, 0: 표시)
      iv_load_policy: 3, // 1: 동영상 특수효과 표시, 3: 동영상 특수효과 미표시
    },
  };
  useEffect(() => {
    if (props.state.videoUrl !== '-') {
      setMounted(true);
    }
  }, [props.state.videoUrl]);

  return (
    <>
      {props.count > 0 && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10 bg-[#000000bd]">
          <p className="text-8xl t text-white">{props.count}</p>
        </div>
      )}
      {mounted && (
        <YouTube
          videoId={props.state.videoUrl}
          onReady={(event) => {
            props.playerRef.current = event.target;
            props.playerRef.current.playVideo();
            props.callbackRef.current?.func(); // 플레이어가 렌더링되기 전에 호출한 메서드 실행
          }}
          onEnd={() => {
            if (props.state.repeat)
              props.playerRef.current.seekTo(props.state.videoStart, true);
            else props.addViewCount();
            props.playerRef.current.playVideo();
          }}
          opts={opts}
        />
      )}
    </>
  );
};
export default VideoContainer;
