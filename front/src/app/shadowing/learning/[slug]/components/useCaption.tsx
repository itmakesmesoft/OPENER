import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { captionType, videoInfoRef, searchWordType } from '@/types/share';
import { YouTubePlayer } from 'react-youtube';

const useCaption = (
  videoInfoRef: MutableRefObject<videoInfoRef>,
  playerRef: MutableRefObject<YouTubePlayer>,
  checkDict: boolean,
  isShowKorCap: boolean,
) => {
  const rAf = useRef<number | null>(null);
  const reg = /[`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/gim;
  const [caption, setCaption] = useState<captionType>();
  const [searchWord, setSearchWord] = useState<searchWordType | null>(null); // 단어 검색 시, 해당 단어가 담길 상태변수

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

  // 특정 구간 자막이 없는 경우, 이전 자막 더 보여지도록 스로틀링 적용
  const throttling = useRef<NodeJS.Timeout | null>(null);
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

  const searchDict = async (w: string, idx: number) => {
    const word = w.toLowerCase().replace(reg, '');
    setSearchWord({
      index: idx,
      word: word,
      meaning: '예문',
      wordType: '단어',
      level: '쉬움',
    });
    // return await dictionaryApi(word).then((res) => {
    //   if (res.status === 200) {
    //     setSearchWord(res.data.data);
    //   }
    // });
  };

  const renderCaption = () => (
    <div className="mt-2 mb-5 min-h-[60px]">
      <div className="english_subtitle whitespace-pre-wrap text-[1em]">
        {caption?.eng?.split(' ').map((word: string, index: number) => {
          return (
            <span key={index}>
              <span
                onClick={() => {
                  searchDict(word, index);
                }}
                className={`cursor-pointer hover:bg-[#e8e8e8]${
                  searchWord?.index === index &&
                  searchWord.word === word &&
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
        <p className="text-[#787878]">{isShowKorCap && caption?.kor}</p>
      </div>
    </div>
  );
  return { caption, renderCaption, findCurrentCaptionIndex, searchWord };
};

export default useCaption;
