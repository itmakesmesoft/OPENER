'use client';

import {
  getVideoInfoApi,
  setCountVideoApi,
  setBookmarkApi,
} from '@/app/api/shadowingApi';
import Link from 'next/link';
import { TfiAngleLeft } from 'react-icons/tfi';
import { useState, useEffect, useRef, ReactNode } from 'react';
import ArrowButtons from './components/ArrowButtons';
import HeaderButtons from './components/HeaderButtons';
import FooterButtons from './components/FooterButtons';
import ViewDictionary from './components/ViewDictionary';
import { stateType, videoInfoType } from '@/types/share';
import useYoutubePlayer from './components/useYoutubePlayer';
import useCheckPron from './components/useCheckPron';

import { AiOutlinePause } from 'react-icons/ai';
import { BsChevronLeft, BsMic } from 'react-icons/bs';

const defaultState = {
  views: 0, // 학습한 횟수
  marked: false,
  repeat: false,
};

const Button = ({
  children,
  ariaLabel,
  onClick,
  className,
}: {
  children: ReactNode;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    className={`rounded-full bg-[#F0F0F0] hover:bg-[#f7f7f7] active:bg-[#f1f1f1] ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const page = ({ params }: { params: { slug: string } }) => {
  const videoId = params.slug;
  const [videoInfo, setVideoInfo] = useState<videoInfoType>(); // 가져온 영상 정보를 담는 state
  const [state, setState] = useState<stateType>(defaultState); // 가져온 영상 정보를 담는 state
  const [speed, setSpeed] = useState<number>(1); // 영상 재생 속도 => 1 / 0.75 / 0.5
  const [isShownKorean, setIsShownKorean] = useState<boolean>(true); // 한글 자막 켜기 => true/false
  const [isOpenDict, setIsOpenDict] = useState<boolean>(false); // 단어 사전 켜기 => true/false
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    getVideoInfo();
    setKoreanCaption();
  }, []);

  // addViewCount : 영상 조회수 1 증가
  const addViewCount = (): void => {
    setCountVideoApi(videoId);
    setState((prevData) => {
      return { ...prevData, views: state.views + 1 };
    });
  };

  const openDictionary = () => {
    setIsOpenDict(true);
  };

  const closeDictionary = () => {
    setIsOpenDict(false);
    caption.current.unfocus();
  };

  const { player, findCaption, caption } = useYoutubePlayer({
    videoInfo: videoInfo,
    onFocusWord: openDictionary,
    onEnd: addViewCount,
  });

  // 한글자막 조건부 표시 (조회수가 10 미만인 경우 표시)
  const setKoreanCaption = () => {
    setIsShownKorean(state.views > 10 ? false : true);
  };

  // 영상 정보 가져오기
  const getVideoInfo = async () => {
    return await getVideoInfoApi(videoId).then((data) => {
      // UI 변경을 위한 상태정보 담기
      setVideoInfo({
        url: data.videoUrl,
        videoStart: data.start,
        videoEnd: data.end,
        engCaption: data.engCaption,
        korCaption: data.korCaption,
      });
      setState({
        views: (data.repeat + 1) | 1,
        marked: data.marked,
        repeat: false,
      });
    });
  };

  // 영상 북마크
  const setBookmark = (): void => {
    setBookmarkApi(videoId);
    setState((prevData) => {
      return { ...prevData, marked: !state.marked };
    });
  };

  // 영상 재생 속도 조절 => 1, 0.75, 0.5 순서
  const setPlayerSpeed = (): void => {
    if (!isPlayerReady(setPlayerSpeed)) return;
    const nextSpeed = speed > 0.5 ? speed - 0.25 : 1;
    player.speed(nextSpeed);
    setSpeed(nextSpeed);
  };

  // 반복 재생
  const setRepeat = (): void => {
    if (!isPlayerReady(setRepeat)) return;
    if (!state.repeat) player.repeat();
    else player.unRepeat();
    setState((prevData) => {
      return { ...prevData, repeat: !state.repeat };
    });
  };

  // 다음 자막으로 건너뜀
  const nextCaption = (): void => {
    if (!isPlayerReady(nextCaption)) return;
    const time = findCaption.next();
    if (time === null) return player.seekTo(videoInfo?.videoEnd);
    if (state.repeat) player.repeat(time[0], time[1]);
    return player.seekTo(time[0]);
  };

  // 이전 자막으로 돌아감
  const prevCaption = (): void => {
    if (!isPlayerReady(prevCaption)) return;
    const time = findCaption.prev();
    if (time === null) return player.seekTo(0);
    if (state.repeat) player.repeat(time[0], time[1]);
    return player.seekTo(time[0]);
  };

  // 발음 평가 커스텀 훅
  const {
    count,
    startRecord,
    stopRecord,
    isRecording,
    renderCheckPron,
    renderResultPron,
    isOpenEvaluation,
    setIsOpenEvaluation,
  } = useCheckPron(caption.current.eng);

  // 발음 평가 켜기
  const openEvaluatePron = (): void => {
    if (!isPlayerReady(openEvaluatePron)) return;
    player.seekToCapStart();
    player.repeat();
    player.mute();
    player.pause();
    startRecord();
  };

  useEffect(() => {
    if (isOpenEvaluation && count === 0) {
      player.play();
    }
  }, [count]);

  // 발음 평가 끄기
  const closeEvaluatePron = (): void => {
    player.unRepeat();
    player.unMute();
    stopRecord();
    setState((prevData) => {
      return { ...prevData, repeat: false };
    });
    setIsOpenEvaluation(false);
  };

  const isPlayerReady = (callback: () => void) => {
    if (playerStatusRef.current === 2) return true;
    callbackRef.current = callback;
    player.play();
    return false;
  };

  const playerStatusRef = useRef<number>();
  useEffect(() => {
    playerStatusRef.current = player.status;
    if (player.status === 2 && callbackRef.current) {
      callbackRef.current();
    }
  }, [player.status]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {count > 0 && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10 bg-[#000000bd]">
          <p className="text-8xl t text-white">{count}</p>
        </div>
      )}
      {player.render()}
      <div className="h-[60vh] sm:h-[50vh] md:h-[40vh] lg:h-[30vh] w-full p-4 overflow-y-auto flex flex-col items-center ">
        <div className="relative w-full lg:w-[85%] rounded-lg bg-white shadow-lg py-6 px-10 flex flex-col md:flex-row justify-between max-w-[1024px] md:h-full">
          {isOpenEvaluation && (
            <div className="w-full h-full flex flex-col justify-between">
              {renderCheckPron()}
              <div className="w-full relative">
                <Button
                  className="p-2 absolute bottom-0 left-0"
                  ariaLabel="발음평가 종료"
                  onClick={closeEvaluatePron}
                >
                  <BsChevronLeft />
                </Button>
                <div className="flex flex-row justify-center">
                  {isRecording ? (
                    <Button
                      className="p-4"
                      ariaLabel="녹음 정지"
                      onClick={stopRecord}
                    >
                      <AiOutlinePause size={'2rem'} />
                    </Button>
                  ) : (
                    <Button
                      className="p-4"
                      ariaLabel="녹음 시작"
                      onClick={openEvaluatePron}
                    >
                      <BsMic size={'2rem'} />
                    </Button>
                  )}
                </div>
              </div>
              {renderResultPron()}
            </div>
          )}
          {!isOpenEvaluation && (
            <div className="w-full flex flex-col justify-between">
              <ArrowButtons
                prevCaption={prevCaption}
                nextCaption={nextCaption}
              />
              <HeaderButtons
                speed={speed}
                isShownKorean={isShownKorean}
                setPlayerSpeed={setPlayerSpeed}
                setIsShownKorean={setIsShownKorean}
              />
              <div className="ml-3 text-lg lg:text-xl">
                {caption.render.eng()}
                {caption.render.kor()}
              </div>
              <FooterButtons
                state={state}
                setBookmark={setBookmark}
                setRepeat={setRepeat}
                openEvaluatePron={openEvaluatePron}
              />
            </div>
          )}

          {!isOpenEvaluation && isOpenDict && (
            <div className="hidden md:flex flex-col justify-between w-full pl-8 ml-8 border-l">
              <ViewDictionary
                word={caption.current.focused}
                closeDict={closeDictionary}
              />
            </div>
          )}
        </div>
        {isOpenDict && (
          <div className="md:hidden shadow-lg mt-4 flex flex-col justify-between  py-6 px-8 relative w-full rounded-xl bg-white ">
            <ViewDictionary
              word={caption.current.focused}
              closeDict={closeDictionary}
            />
          </div>
        )}
      </div>
      <div className="w-full p-4 fixed top-0 left-0 hover:bg-[#0000002c] hover:backdrop-blur-md">
        <Link
          href={'/shadowing'}
          aria-label="뒤로가기"
          className="group inline-block bg-[#0000006c] hover:bg-brandY p-3 rounded-full shadow-lg"
        >
          <TfiAngleLeft
            size="1.8rem"
            className="fill-white group-hover:fill-black"
          />
        </Link>
      </div>
    </div>
  );
};
export default page;
