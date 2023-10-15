import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { captionType, videoInfoRef, searchWordType } from '@/types/share';
import CaptionComponent from './CaptionComponent';
import { YouTubePlayer } from 'react-youtube';

const useCaption = (
  videoInfoRef: MutableRefObject<videoInfoRef>,
  playerRef: MutableRefObject<YouTubePlayer>,
  checkDict: boolean,
  isShowKorCap: boolean,
) => {
  const [caption, setCaption] = useState<captionType>();
  const [searchWord, setSearchWord] = useState<searchWordType | null>(null);
  const rAf = useRef<number | null>(null);
  const throttling = useRef<NodeJS.Timeout | null>(null); // 특정 구간 자막이 없는 경우, 이전 자막 더 보여지도록 스로틀링 적용

  useEffect(() => {
    ObservePlayer(); // Mount시 Observe 시작
    return () => {
      if (rAf.current) {
        cancelAnimationFrame(rAf.current); // <= 메모리 누수 방지
        rAf.current = null;
      }
    };
  }, []);

  //----------------------------
  const ObservePlayer = () => {
    const videoInfo = videoInfoRef.current;
    if (videoInfo.repeat || checkDict) {
      const index = videoInfo.repeatIndex;
      if (index !== null) {
        const time = playerRef.current.getCurrentTime();
        const end = videoInfo.engCaption[index].endTime;
        if (time > end)
          playerRef.current.seekTo(videoInfo.engCaption[index].startTime, true);
      }
    }
    setCurrentCaption();
    rAf.current = requestAnimationFrame(ObservePlayer);
  };

  const findCurrentCaptionIndex = () => {
    const time = playerRef.current?.getCurrentTime();
    if (videoInfoRef.current) {
      for (let i = 0; i < videoInfoRef.current.engCaption.length; i++) {
        const start = videoInfoRef.current.engCaption[i].startTime;
        const end = videoInfoRef.current.engCaption[i].endTime;
        if (time >= start && time < end) return i;
      }
    }
    return -1;
  };

  const setCurrentCaption = () => {
    const videoInfo = videoInfoRef.current;
    const index = findCurrentCaptionIndex();
    if (videoInfo && index > -1) {
      videoInfo.currentCapIndex = index;
      setCaption({
        eng: videoInfo.engCaption[index].text,
        kor: videoInfo.korCaption[index].text,
      });
      if (throttling.current) {
        clearTimeout(throttling.current);
        throttling.current = null;
      }
    } else {
      // 스로틀링 적용 -> 자막이 끝나더라도 최소 1초는 더 보여지도록 구현
      if (!throttling.current) {
        throttling.current = setTimeout(() => {
          setCaption({
            eng: '',
            kor: '',
          });
        }, 1000);
      }
    }
  };

  const renderCaption = () => (
    <CaptionComponent
      isShowKorCap={isShowKorCap}
      caption={caption}
      setSearchWord={setSearchWord}
    />
  );
  return { caption, renderCaption, findCurrentCaptionIndex, searchWord };
};

export default useCaption;
