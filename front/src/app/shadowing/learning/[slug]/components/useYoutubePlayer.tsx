import { vttToCaption } from './modules';
import { useEffect, useRef, useState } from 'react';
import { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import {
  videoInfoType,
  captionType,
  infoRefType,
  searchWordType,
} from '@/types/share';
import Image from 'next/image';
import styles from './player.module.css';
import dynamic from 'next/dynamic';

const YouTube = dynamic(() => import('./VideoContainer'), {
  ssr: false,
});

const useYoutubePlayer = ({
  videoInfo,
  onFocusWord,
  onEnd,
}: {
  videoInfo: videoInfoType | undefined;
  onFocusWord?: (param: string) => void | undefined;
  onReady?: () => void | undefined;
  onEnd?: () => void | undefined;
}) => {
  const rafRef = useRef<number | null>(null);
  const infoRef = useRef<infoRefType>(); // 영상의 정보를 담을 참조값
  const playerRef = useRef<YouTubePlayer>(null); // 유튜브 플레이어를 참조
  const [caption, setCaption] = useState<captionType>();
  const [focusWord, setFocusWord] = useState<searchWordType | null>(null); // 단어 검색 시, 단어 정보 담길 변수
  const [playerState, setplayerState] = useState<number>(0); // 0: unloaded, 1: request load, 2: loaded

  useEffect(() => {
    ObservePlayer(); // Mount시 Observe 시작
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current); // <= 메모리 누수 방지
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoInfo) {
      const eng = vttToCaption(videoInfo.engCaption);
      const kor = vttToCaption(videoInfo.korCaption);
      infoRef.current = {
        engCaption: eng,
        korCaption: kor,
        capLength: videoInfo.engCaption.length,
        repeatRange: null,
        repeat: false,
      };
    }
  }, [videoInfo]);

  const getCurrentTime = () => {
    return playerRef.current && playerRef.current.getCurrentTime();
  };

  const playerPlay = (): void => {
    if (!playerRef.current) return setplayerState(1);
    playerRef.current.playVideo();
  };

  const playerPause = (): void => {
    playerRef.current && playerRef.current.pauseVideo();
  };

  const playerSeekTo = (time: number | undefined | null): void => {
    if (playerRef.current && time !== null && time !== undefined)
      playerRef.current.seekTo(time, true);
  };

  const playerSeekToCaptionStart = (): void => {
    const time = findCurCaptionTime();
    if (time) playerSeekTo(time[0]);
  };

  const playerMute = (): void => {
    playerRef.current && playerRef.current.mute();
  };

  const playerUnMute = (): void => {
    playerRef.current && playerRef.current.unMute();
  };

  const playerSpeed = (speed: number): void => {
    playerRef.current && playerRef.current.setPlaybackRate(speed);
  };

  const playerRepeat = (start?: number, end?: number): void => {
    if (!infoRef.current) return;
    infoRef.current.repeat = true;
    if (start === undefined || end === undefined) {
      const time = findCaptionTimeByIndex(findCurrentCaptionIndex());
      time !== null && playerRepeat(time[0], time[1]);
      return;
    }
    infoRef.current.repeatRange = [start, end];
  };

  const playerUnRepeat = () => {
    if (!infoRef.current) return;
    infoRef.current.repeat = false;
    infoRef.current.repeatRange = null;
  };

  const onPlayerReady = (event: YouTubeEvent): void => {
    playerRef.current = event.target;
    playerPlay();
    setplayerState(2);
  };

  const onPlayerEnd = () => {
    if (infoRef.current?.repeat && videoInfo)
      playerSeekTo(videoInfo.videoStart);
    playerPlay();
    onEnd && onEnd();
  };

  const handleFocusWord = (word: string, index: number) => {
    if (onFocusWord) onFocusWord(word);
    setFocusWord({
      word: word,
      index: index,
    });
  };

  const findCurrentCaptionIndex = (): number | null => {
    const current = getCurrentTime() || 0;
    if (!infoRef.current) return null;
    for (let i = 0; i < infoRef.current.capLength; i++) {
      const time = findCaptionTimeByIndex(i);
      if (time !== null && current >= time[0] && current < time[1]) return i;
    }
    return null;
  };

  const findCaptionTimeByIndex = (index: number | null): number[] | null => {
    if (!infoRef.current || index === null) return null;
    const caption = infoRef.current.engCaption[index];
    return [caption?.start, caption?.end];
  };

  const findPrevCaptionTime = (): number[] | null => {
    const index = findCurrentCaptionIndex();
    if (index === null || index === undefined) return null;
    return findCaptionTimeByIndex(index >= 1 ? index - 1 : null);
  };

  const findCurCaptionTime = (): number[] | null => {
    const index = findCurrentCaptionIndex();
    if (index === null || index === undefined) return null;
    return findCaptionTimeByIndex(index);
  };

  const findNextCaptionTime = (): number[] | null => {
    const index = findCurrentCaptionIndex();
    if (!infoRef.current || index === null || index === undefined) return null;
    return findCaptionTimeByIndex(
      index < infoRef.current.capLength - 1 ? index + 1 : null,
    );
  };

  // 특정 구간 자막이 없는 경우, 이전 자막 더 보여지도록 타이머 적용
  const timerBeforeCloseCap = useRef<NodeJS.Timeout | null>(null);
  const setCurrentCaption = () => {
    const info = infoRef.current;
    const index = findCurrentCaptionIndex();
    if (info && index !== null && index !== undefined) {
      if (caption?.eng !== info.engCaption[index].text)
        setCaption({
          eng: info.engCaption[index].text,
          kor: info.korCaption[index].text,
        });
      if (timerBeforeCloseCap.current) {
        clearTimeout(timerBeforeCloseCap.current);
        timerBeforeCloseCap.current = null;
      }
    } else {
      // 자막이 끝나더라도 최소 1초는 더 보여지도록 구현
      if (!timerBeforeCloseCap.current) {
        timerBeforeCloseCap.current = setTimeout(() => {
          setCaption({
            eng: '',
            kor: '',
          });
        }, 1000);
      }
    }
  };

  const ObservePlayer = (): void => {
    const info = infoRef.current;
    if (info?.repeat && info.repeatRange !== null) {
      const time = getCurrentTime();
      if (time > info.repeatRange[1]) playerSeekTo(info.repeatRange[0]);
    }
    setCurrentCaption();
    rafRef.current = requestAnimationFrame(ObservePlayer);
  };

  const renderPlayer = () => (
    <div className={styles.videoContainer}>
      {playerState === 0 && videoInfo && (
        <Image
          className="absolute top-0 left-0 w-full h-full object-contain bg-black"
          onClick={() => setplayerState(1)}
          src={`https://img.youtube.com/vi/${videoInfo.url}/0.jpg`}
          height="640"
          width="320"
          alt="thumbnail"
          placeholder="empty"
        />
      )}
      {playerState >= 1 && (
        <YouTube
          refs={playerRef}
          url={videoInfo?.url}
          start={videoInfo?.videoStart}
          end={videoInfo?.videoEnd}
          onReady={onPlayerReady}
          onEnd={onPlayerEnd}
        />
      )}
    </div>
  );

  const renderEngCaption = () => (
    <div className="english_subtitle whitespace-pre-wrap text-[1em]">
      {caption?.eng?.split(' ').map((word: string, index: number) => (
        <span key={index}>
          <span
            onClick={() => handleFocusWord(word, index)}
            className={`cursor-pointer hover:bg-[#e8e8e8]${
              focusWord?.word === word &&
              focusWord?.index === index &&
              'text-[#8224ca] font-semibold underline'
            }`}
          >
            {word}
          </span>{' '}
        </span>
      ))}
    </div>
  );

  const renderKorCaption = () => (
    <div className="korean_subtitle text-[0.8em]">
      <p className="text-[#787878]">{caption?.kor}</p>
    </div>
  );

  return {
    player: {
      status: playerState,
      render: renderPlayer,
      repeat: playerRepeat,
      unRepeat: playerUnRepeat,
      seekTo: playerSeekTo,
      seekToCapStart: playerSeekToCaptionStart,
      play: playerPlay,
      pause: playerPause,
      mute: playerMute,
      unMute: playerUnMute,
      speed: playerSpeed,
    },
    findCaption: {
      next: findNextCaptionTime,
      prev: findPrevCaptionTime,
    },
    caption: {
      render: {
        eng: renderEngCaption,
        kor: renderKorCaption,
      },
      current: {
        eng: caption?.eng,
        kor: caption?.kor,
        focused: focusWord?.word,
        unfocus: () => setFocusWord(null),
      },
    },
  };
};

export default useYoutubePlayer;
