'use client';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

const VideoContainer = (props: {
  refs: YouTubePlayer | undefined;
  start: number | undefined;
  end: number | undefined;
  url: string | undefined;
  onReady?: (event: YouTubeEvent) => void;
  onEnd?: (event: YouTubeEvent) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      loop: 0,
      start: props.start || 0,
      end: props.end !== undefined ? props.end + 1 : 1,
      controls: 0, // 컨트롤바(1: 표시, 0: 미표시)
      autoplay: 1, // 자동재생(1: 설정, 0: 취소)
      rel: 0, // 관련 동영상(1: 표시, 0: 미표시)
      modestbranding: 1, // 컨트롤 바 youtube 로고(1: 미표시, 0: 표시)
      iv_load_policy: 3, // 1: 동영상 특수효과 표시, 3: 동영상 특수효과 미표시
    },
  };
  useEffect(() => {
    if (props.url !== '-') {
      setMounted(true);
    }
  }, [props.url]);

  return (
    <div>
      {mounted && (
        <YouTube
          videoId={props.url}
          onReady={(event) => {
            props.refs.current = event.target;
            props.refs.current.playVideo();
            props.onReady && props.onReady(event); // 플레이어가 준비 되면 실행
          }}
          onEnd={(event) => {
            props.refs.current.playVideo();
            props.onEnd && props.onEnd(event);
          }}
          opts={opts}
        />
      )}
    </div>
  );
};
export default VideoContainer;
