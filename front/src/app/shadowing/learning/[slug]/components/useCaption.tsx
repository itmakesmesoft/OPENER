import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { captionType, infoRefType, searchWordType } from '@/types/share';
import { YouTubePlayer } from 'react-youtube';

const useCaption = (
  videoInfo: MutableRefObject<infoRefType>,
  playerRef: MutableRefObject<YouTubePlayer>,
  openEvaluatePron: boolean,
  showKorCap: boolean,
) => {
  const rAf = useRef<number | null>(null);
  const reg = /[`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/gim;
  const [caption, setCaption] = useState<captionType>();
  const [selectedWord, setSelectedWord] = useState<searchWordType | null>(null); // 단어 검색 시, 단어 정보 담길 변수

  useEffect(() => {
    ObservePlayer(); // Mount시 Observe 시작
    return () => {
      if (rAf.current) {
        cancelAnimationFrame(rAf.current); // <= 메모리 누수 방지
        rAf.current = null;
      }
    };
  }, []);

  const ObservePlayer = () => {
    const info = videoInfo.current;
    if (info.repeat || openEvaluatePron) {
      const index = info.repeatIdx;
      if (index !== null) {
        const time = playerRef.current.getCurrentTime();
        const end = info.engCaption[index].end;
        if (time > end)
          playerRef.current.seekTo(info.engCaption[index].start, true);
      }
    }
    setCurrentCaption();
    rAf.current = requestAnimationFrame(ObservePlayer);
  };

  const findCurrentCaptionIndex = () => {
    const time = playerRef.current?.getCurrentTime() || 0;
    if (videoInfo.current) {
      for (let i = 0; i < videoInfo.current.engCaption.length; i++) {
        const start = videoInfo.current.engCaption[i].start;
        const end = videoInfo.current.engCaption[i].end;
        if (time >= start && time < end) return i;
      }
    }
    return -1;
  };

  // 특정 구간 자막이 없는 경우, 이전 자막 더 보여지도록 스로틀링 적용
  const throttling = useRef<NodeJS.Timeout | null>(null);

  const setCurrentCaption = () => {
    const info = videoInfo.current;
    const index = findCurrentCaptionIndex();
    if (info && index > -1) {
      info.currentCapIdx = index;
      if (caption?.eng !== info.engCaption[index].text)
        setCaption({
          eng: info.engCaption[index].text,
          kor: info.korCaption[index].text,
        });
      if (throttling.current) {
        clearTimeout(throttling.current);
        throttling.current = null;
      }
    } else {
      // 스로틀링 적용 => 자막이 끝나더라도 최소 1초는 더 보여지도록 구현
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
    <div className="mt-2 mb-5 min-h-[60px]">
      <div className="english_subtitle whitespace-pre-wrap text-[1em]">
        {caption?.eng?.split(' ').map((word: string, index: number) => {
          return (
            <span key={index}>
              <span
                onClick={() => {
                  setSelectedWord({
                    word: word.toLowerCase().replace(reg, ''),
                    index: index,
                    origin: origin,
                  });
                }}
                className={`cursor-pointer hover:bg-[#e8e8e8]${
                  selectedWord?.origin === word &&
                  selectedWord?.index === index &&
                  'text-[#8224ca] font-semibold underline'
                }`}
              >
                {word}
              </span>{' '}
            </span>
          );
        })}
      </div>
      <div className="korean_subtitle text-[0.8em]">
        <p className="text-[#787878]">{showKorCap && caption?.kor}</p>
      </div>
    </div>
  );
  return {
    caption,
    renderCaption,
    findCurrentCaptionIndex,
    selectedWord,
    resetWord: () => setSelectedWord(null),
  };
};

export default useCaption;
