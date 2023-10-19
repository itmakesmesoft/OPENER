'use client';

import {
  getVideoApi,
  setCountVideoApi,
  setBookmarkApi,
  // dictionaryApi,
} from '@/app/api/shadowingApi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { YouTubePlayer } from 'react-youtube';
import { TfiAngleLeft } from 'react-icons/tfi';
import { useRef, useState, useEffect } from 'react';
import ArrowButtons from './components/ArrowButtons';
import HeaderButtons from './components/HeaderButtons';
import FooterButtons from './components/FooterButtons';
import ViewDictionary from './components/ViewDictionary';
import { stateType, videoInfoRef } from '@/types/share';
import { vttToCaption, convertTime } from './components/modules';
import useCaption from './components/useCaption';
import useCheckPron from './components/CheckPron';
import styles from './components/player.module.css';

const VideoContainer = dynamic(() => import('./components/VideoContainer'), {
  ssr: false,
});

const defaultState = {
  videoUrl: '-',
  videoStart: 0,
  videoEnd: 0,
  views: 0, // 학습한 횟수
  marked: false,
  repeat: false,
};

const defaultVideoInfo = {
  engCaption: [],
  korCaption: [],
  currentCapIndex: -1,
  repeatIndex: null,
  repeat: false,
};

const page = ({ params }: { params: { slug: string } }) => {
  const videoId = params.slug;
  const playerRef = useRef<YouTubePlayer>(null); // 유튜브 플레이어를 참조
  const videoInfoRef = useRef<videoInfoRef>(defaultVideoInfo); // 영상의 정보를 담을 참조값
  const [state, setState] = useState<stateType>(defaultState); // 가져온 영상 정보를 담는 state
  const [speed, setSpeed] = useState<number>(1); // 영상 재생 속도 => 1 / 0.75 / 0.5
  const [play, setPlay] = useState(false); // play가 true가 되면, YT플레이어 동적 로드 후 재생
  const [showKorCap, setShowKorCap] = useState<boolean>(true); // 한글 자막 켜기 => true/false
  const [openEvaluatePron, setOpenEvaluatePron] = useState<boolean>(false); // 발음 평가 켜기 => true/false
  const {
    caption: currentCaption,
    renderCaption,
    findCurrentCaptionIndex,
    searchWord,
  } = useCaption(videoInfoRef, playerRef, openEvaluatePron, showKorCap);

  useEffect(() => {
    getVideo(videoId).then((data) => {
      const videoStart = convertTime(data.start);
      const videoEnd = convertTime(data.end);
      videoInfoRef.current = {
        ...videoInfoRef.current,
        engCaption: vttToCaption(data.engCaption),
        korCaption: vttToCaption(data.korCaption),
      };
      setState({
        videoUrl: data.videoUrl,
        videoStart: videoStart,
        videoEnd: videoEnd,
        views: (data.repeat + 1) | 1,
        marked: data.marked,
        repeat: false,
      });
      setShowKorCap(state.views > 10 ? false : true); // 조회수 10 초과 시 한글 자막 보이지 않도록 함
      // setPlay(true);
    });
  }, []);

  // getVideo : 영상 정보 가져오기
  const getVideo = async (videoId: string) => {
    return await getVideoApi(videoId);
  };

  // bookMark : 영상 북마크
  const bookMark = (): void => {
    setBookmarkApi(videoId);
    setState((prevData) => {
      return { ...prevData, marked: !state.marked };
    });
  };

  // addViewCount : 영상 조회수 1 증가
  const addViewCount = (): void => {
    setCountVideoApi(videoId);
    setState((prevData) => {
      return { ...prevData, views: state.views + 1 };
    });
  };

  // setPlayerSpeed : 영상 재생 속도 조절 => 1, 0.75, 0.5 순서
  const setPlayerSpeed = (): void => {
    let expected = speed;
    if (speed > 0.5) expected = speed - 0.25;
    else expected = 1;
    playerRef.current.setPlaybackRate(expected);
    setSpeed(expected);
  };

  // checkRepeat : 반복 재생
  const checkRepeat = (): void => {
    const info = videoInfoRef.current;
    if (!playerRef.current) return callback(checkRepeat);
    if (info) {
      info.repeatIndex = info.currentCapIndex;
      info.repeat = !info.repeat;
      setState((prevData) => {
        return { ...prevData, repeat: info.repeat };
      });
    }
  };

  // nextCaption : 다음 자막으로 건너뜀
  const nextCaption = (): void => {
    const videoRef = videoInfoRef.current;
    if (!playerRef.current) return callback(nextCaption);
    if (videoRef) {
      const index = findCurrentCaptionIndex();
      let newIndex = videoRef.currentCapIndex + 1;
      if (index !== -1 && index + 1 < videoRef.engCaption.length) {
        newIndex = index + 1;
        if (state.repeat) videoRef.repeatIndex = newIndex;
      }
      playerRef.current.seekTo(videoRef.engCaption[newIndex].startTime, true);
    }
  };

  // prevCaption : 이전 자막으로 돌아감
  const prevCaption = (): void => {
    const videoRef = videoInfoRef.current;
    if (!playerRef.current) return callback(prevCaption);
    if (videoRef) {
      const index = findCurrentCaptionIndex();
      let newIndex = videoRef.currentCapIndex;
      if (index !== -1 && index > 0) {
        newIndex = index - 1;
        if (state.repeat) videoRef.repeatIndex = newIndex;
      }
      playerRef.current.seekTo(videoRef.engCaption[newIndex].startTime, true);
    }
  };

  // evaluatePron : 발음 평가 켜기/끄기 => true: 켜기 / false: 끄기
  const evaluatePron = (param = false): void => {
    const info = videoInfoRef.current;
    if (!playerRef.current) return callback(() => evaluatePron(true));
    if (param && info.currentCapIndex > -1) {
      console.log(info.currentCapIndex);
      setOpenEvaluatePron(true);
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
      setOpenEvaluatePron(false);
      setState((prevData) => {
        return { ...prevData, repeat: false };
      });
    }
  };

  const { count, renderCheckPron } = useCheckPron(
    playerRef,
    openEvaluatePron,
    currentCaption?.eng,
    evaluatePron,
  );

  // 실험 기능
  // 플레이어가 로드되기 전 메서드가 호출될 경우,
  // callbackRef 넣어두고, 플레이어가 로드된 이후에 실행
  const callbackRef = useRef<{ func: (param?: unknown) => void } | null>(null);
  const callback = (func: (param: unknown) => void) => {
    callbackRef.current = { func: (param: unknown) => func(param) };
    setPlay(true);
  };
  //======================================================================

  return (
    <div className="flex flex-col justify-start items-center absolute top-0 left-0 w-screen min-h-screen pb-[68px] lg:pb-0">
      <div className={styles.videoContainer}>
        {state.videoUrl !== '-' && (
          <img
            className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            onClick={() => setPlay(true)}
            src={`https://img.youtube.com/vi/${state.videoUrl}/0.jpg`}
            height="640"
            width="320"
            alt="thumbnail"
            placeholder="empty"
          />
        )}
        {play && (
          <VideoContainer
            count={count}
            state={state}
            playerRef={playerRef}
            callbackRef={callbackRef}
            addViewCount={addViewCount}
          />
        )}
      </div>
      <div className="w-full lg:w-[85%] py-5 px-8 max-w-[1024px]">
        <div className="relative w-full h-full rounded-lg bg-white shadow-custom py-6 px-8 flex flex-col lg:flex-row justify-between lg:min-h-[250px]">
          <div className="w-full flex flex-col justify-between h-auto">
            {openEvaluatePron ? (
              renderCheckPron()
            ) : (
              <>
                <HeaderButtons
                  speed={speed}
                  showKorCap={showKorCap}
                  setPlayerSpeed={setPlayerSpeed}
                  setShowKorCap={setShowKorCap}
                />
                <ArrowButtons
                  prevCaption={prevCaption}
                  nextCaption={nextCaption}
                />
                <div className="text-lg lg:text-xl">{renderCaption()}</div>
                <FooterButtons
                  state={state}
                  bookMark={bookMark}
                  checkRepeat={checkRepeat}
                  checkPron={evaluatePron}
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
        aria-label="뒤로가기"
        className="hidden lg:block fixed left-4 bottom-5 bg-[#fff] hover:bg-brandY p-3 rounded-full shadow-custom"
      >
        <TfiAngleLeft size="1.8rem" />
      </Link>
    </div>
  );
};
export default page;
