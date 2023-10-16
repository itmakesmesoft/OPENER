'use client';
// modules
import Link from 'next/link';
import { TfiAngleLeft } from 'react-icons/tfi';
import { useRef, useState, useEffect } from 'react';
import { YouTubePlayer } from 'react-youtube';

// components
// import CheckDiction from './components/CheckDiction';
import ArrowButtons from './components/ArrowButtons';
import HeaderButtons from './components/HeaderButtons';
import FooterButtons from './components/FooterButtons';
import VideoContainer from './components/VideoContainer';
import ViewDictionary from './components/ViewDictionary';

// api, type-interface, methods
import { stateType, videoInfoRef } from '@/types/share';
import {
  getVideoApi,
  setCountVideoApi,
  setBookmarkApi,
  // dictionaryApi,
} from '@/app/api/shadowingApi';
import { vttToCaption, convertTime } from './components/modules';
import useCaption from './components/useCaption';
import useCheckDiction from './components/CheckDiction';

const page = ({ params }: { params: { slug: string } }) => {
  const videoId = params.slug;
  const playerRef = useRef<YouTubePlayer>(null);
  const [speed, setSpeed] = useState<number>(1);
  // const [count, setCount] = useState<number>(-1); // 발음체크 시 카운트를 담을 state
  const [isShowKorCap, setIsShowKorCap] = useState<boolean>(true);
  const [isCheckDiction, setIsCheckDiction] = useState<boolean>(false);
  const [state, setState] = useState<stateType>({
    videoUrl: '-',
    videoStart: 0,
    videoEnd: 0,
    views: 0, // 학습한 횟수
    marked: false,
    repeat: false,
  });
  const videoInfoRef = useRef<videoInfoRef>({
    // 가져온 영상 정보를 담는 state
    videoUrl: '',
    videoStart: 0,
    videoEnd: 0,
    engCaption: [],
    korCaption: [],
    currentCapIndex: -1,
    repeatIndex: null,
    marked: false, // 북마크 여부
    repeat: false,
  });
  const {
    caption: currentCaption,
    renderCaption,
    findCurrentCaptionIndex,
    searchWord,
  } = useCaption(videoInfoRef, playerRef, isCheckDiction, isShowKorCap);

  useEffect(() => {
    getVideo(videoId).then((data) => {
      const videoStart = convertTime(data.start);
      const videoEnd = convertTime(data.end);
      videoInfoRef.current = {
        ...videoInfoRef.current,
        videoStart: videoStart,
        videoEnd: videoEnd,
        engCaption: vttToCaption(data.engCaption),
        korCaption: vttToCaption(data.korCaption),
        videoUrl: data.videoUrl,
        marked: data.marked,
      };
      setState({
        videoUrl: data.videoUrl,
        videoStart: videoStart,
        videoEnd: videoEnd,
        views: (data.repeat + 1) | 1,
        marked: data.marked,
        repeat: false,
      });
      setIsShowKorCap(state.views > 10 ? false : true);
    });
  }, []);

  const getVideo = async (videoId: string) => {
    return await getVideoApi(videoId);
  };

  const bookMark = (): void => {
    setBookmarkApi(videoId);
    setState((prevData) => {
      return { ...prevData, marked: !state.marked };
    });
  };

  const addViewCount = (): void => {
    setCountVideoApi(videoId);
    setState((prevData) => {
      return { ...prevData, views: state.views + 1 };
    });
  };

  const nextCaption = (): void => {
    const index = findCurrentCaptionIndex();
    const videoRef = videoInfoRef.current;
    if (!videoRef) return;
    if (index !== -1 && index < videoRef.engCaption.length - 1) {
      if (state.repeat) videoRef.repeatIndex = index + 1;
      playerRef.current.seekTo(videoRef.engCaption[index + 1].startTime, true);
    } else {
      playerRef.current.seekTo(
        videoRef.engCaption[videoRef.currentCapIndex + 1].startTime,
        true,
      );
    }
  };

  const prevCaption = (): void => {
    const index = findCurrentCaptionIndex();
    const videoRef = videoInfoRef.current;
    if (!videoRef) return;
    if (index !== -1 && index > 0) {
      if (state.repeat) videoRef.repeatIndex = index - 1;
      playerRef.current.seekTo(videoRef.engCaption[index - 1].startTime, true);
    } else {
      playerRef.current.seekTo(
        videoRef.engCaption[videoRef.currentCapIndex].startTime,
        true,
      );
    }
  };

  const setPlayerSpeed = (): void => {
    let expected = speed;
    if (speed > 0.5) expected = speed - 0.25;
    else expected = 1;
    playerRef.current.setPlaybackRate(expected);
    setSpeed(expected);
  };

  const checkRepeat = (): void => {
    const info = videoInfoRef.current;
    if (info) {
      info.repeatIndex = info.currentCapIndex;
      info.repeat = !info.repeat;
      setState((prevData) => {
        return { ...prevData, repeat: info.repeat };
      });
    }
  };

  const evaluateDiction = (param = false): void => {
    const info = videoInfoRef.current;
    if (param && info.currentCapIndex > -1) {
      console.log(info.currentCapIndex);
      setIsCheckDiction(true);
      info.repeatIndex = info.currentCapIndex;
      info.repeat = true;
      playerRef.current
        .seekTo(info.engCaption[info.repeatIndex].startTime, true)
        .mute()
        .pauseVideo();
    } else {
      info.repeatIndex = null;
      info.repeat = false;
      playerRef.current.playVideo().unMute();
      setIsCheckDiction(false);
      setState((prevData) => {
        return { ...prevData, repeat: false };
      });
    }
  };

  const { count, renderCheckDiction } = useCheckDiction(
    playerRef,
    isCheckDiction,
    currentCaption?.eng,
    evaluateDiction,
  );

  return (
    <div className="relative flex flex-col justify-start items-center lg:absolute lg:top-0 lg:left-0 w-full h-full">
      <VideoContainer
        playerRef={playerRef}
        repeat={state.repeat}
        count={count}
        videoUrl={state.videoUrl}
        videoStart={state.videoStart}
        videoEnd={state.videoEnd}
        addViewCount={addViewCount}
      />
      <div className="w-full lg:w-[85%] py-5 px-8 max-w-[1024px]">
        <div className="relative w-full h-full rounded-lg bg-white shadow-custom py-6 px-8 flex flex-col lg:flex-row justify-between lg:min-h-[250px]">
          <div className="w-full flex flex-col justify-between h-full">
            {isCheckDiction ? (
              renderCheckDiction()
            ) : (
              <>
                <HeaderButtons
                  speed={speed}
                  isShowKorCap={isShowKorCap}
                  setPlayerSpeed={setPlayerSpeed}
                  setIsShowKorCap={setIsShowKorCap}
                />
                <ArrowButtons
                  prevCaption={prevCaption}
                  nextCaption={nextCaption}
                />
                <div className="sm:text-base md:text-lg lg:text-xl">
                  {renderCaption()}
                </div>
                <FooterButtons
                  state={state}
                  bookMark={bookMark}
                  checkRepeat={checkRepeat}
                  checkDiction={evaluateDiction}
                />
              </>
            )}
          </div>
          {searchWord && (
            <div className="hidden lg:flex flex-col justify-between w-full pl-8 ml-8 border-l">
              <ViewDictionary word={searchWord} />
            </div>
          )}
        </div>
        {searchWord && (
          <div className="lg:hidden shadow-custom mt-4 flex flex-col justify-between  py-6 px-8 relative w-full rounded-xl min-h-[200px] bg-white ">
            <ViewDictionary word={searchWord} />
          </div>
        )}
      </div>
      <Link
        href={'/shadowing'}
        className="hidden lg:block fixed left-4 bottom-5 bg-[#fff] hover:bg-brandY p-3 rounded-full shadow-custom"
      >
        <TfiAngleLeft size="1.8rem" />
      </Link>
    </div>
  );
};
export default page;
