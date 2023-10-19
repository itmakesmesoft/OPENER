'use client';

import {
  getVideoInfoApi,
  setCountVideoApi,
  setBookmarkApi,
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
import { stateType, infoRefType } from '@/types/share';
import { vttToCaption, convertTime } from './components/modules';
import useCaption from './components/useCaption';
import useCheckPron from './components/useCheckPron';
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
  capLength: 0,
  currentCapIdx: -1,
  repeatIdx: null,
  repeat: false,
};

const page = ({ params }: { params: { slug: string } }) => {
  const videoId = params.slug;
  const playerRef = useRef<YouTubePlayer>(null); // 유튜브 플레이어를 참조
  const infoRef = useRef<infoRefType>(defaultVideoInfo); // 영상의 정보를 담을 참조값
  const [state, setState] = useState<stateType>(defaultState); // 가져온 영상 정보를 담는 state
  const [speed, setSpeed] = useState<number>(1); // 영상 재생 속도 => 1 / 0.75 / 0.5
  const [playerLoad, setPlayerLoad] = useState(false); // play가 true가 되면, YT플레이어 동적 로드 후 재생
  const [showKorCap, setShowKorCap] = useState<boolean>(true); // 한글 자막 켜기 => true/false
  const [openEvaluatePron, setOpenEvaluatePron] = useState<boolean>(false); // 발음 평가 켜기 => true/false
  const {
    caption: currentCaption,
    renderCaption,
    findCurrentCaptionIndex,
    searchWord,
    resetWord,
  } = useCaption(infoRef, playerRef, openEvaluatePron, showKorCap);

  useEffect(() => {
    getVideoInfo(videoId).then((data) => {
      const videoStart = convertTime(data.start);
      const videoEnd = convertTime(data.end);
      const engCaption = vttToCaption(data.engCaption);
      const korCaption = vttToCaption(data.korCaption);
      infoRef.current = {
        ...infoRef.current,
        engCaption: engCaption,
        korCaption: korCaption,
        capLength: engCaption.length,
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

  // getVideoInfo : 영상 정보 가져오기
  const getVideoInfo = async (videoId: string) => {
    return await getVideoInfoApi(videoId);
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
    const nextSpeed = speed > 0.5 ? speed - 0.25 : 1;
    playerRef.current.setPlaybackRate(nextSpeed);
    setSpeed(nextSpeed);
  };

  // checkRepeat : 반복 재생
  const checkRepeat = (): void => {
    const info = infoRef.current;
    if (!info) return;
    if (!playerRef.current) return callback(checkRepeat);
    info.repeatIdx = info.currentCapIdx;
    info.repeat = !info.repeat;
    setState((prevData) => {
      return { ...prevData, repeat: info.repeat };
    });
  };

  // nextCaption : 다음 자막으로 건너뜀
  const nextCaption = (): void => {
    const info = infoRef.current;
    if (!info) return;
    if (!playerRef.current) return callback(nextCaption);
    const index = findCurrentCaptionIndex();
    let nextIdx = info.currentCapIdx + 1;
    if (index !== -1 && index + 1 < info.capLength) nextIdx = index + 1;
    if (state.repeat) info.repeatIdx = nextIdx;
    playerRef.current.seekTo(info.engCaption[nextIdx].start, true);
  };

  // prevCaption : 이전 자막으로 돌아감
  const prevCaption = (): void => {
    const info = infoRef.current;
    if (!info) return;
    if (!playerRef.current) return callback(prevCaption);
    const index = findCurrentCaptionIndex();
    let prevIdx = info.currentCapIdx;
    if (index !== -1 && index > 0) prevIdx = index - 1;
    if (state.repeat) info.repeatIdx = prevIdx;
    playerRef.current.seekTo(info.engCaption[prevIdx].start, true);
  };

  // evaluatePron : 발음 평가 켜기/끄기 => true: 켜기 / false: 끄기
  const evaluatePron = (param = false): void => {
    const info = infoRef.current;
    if (!playerRef.current) return callback(() => evaluatePron(true));
    if (param && info.currentCapIdx > -1) {
      setOpenEvaluatePron(true);
      info.repeatIdx = info.currentCapIdx;
      info.repeat = true;
      playerRef.current
        .seekTo(info.engCaption[info.repeatIdx].start, true)
        .mute()
        .pauseVideo();
    } else {
      info.repeatIdx = null;
      info.repeat = false;
      playerRef.current.playVideo().unMute();
      setOpenEvaluatePron(false);
      setState((prevData) => {
        return { ...prevData, repeat: false };
      });
    }
  };

  // 발음 평가 커스텀 훅
  const { count: countBeforeCheckPron, renderCheckPron } = useCheckPron(
    playerRef,
    openEvaluatePron,
    currentCaption?.eng,
    evaluatePron,
  );

  // 플레이어가 로드되기 전 메서드가 호출될 경우,
  // callbackRef 넣어두고, 플레이어가 로드된 이후에 실행
  const callbackRef = useRef<{ func: (param?: unknown) => void } | null>(null);
  const callback = (func: (param: unknown) => void) => {
    callbackRef.current = { func: (param: unknown) => func(param) };
    setPlayerLoad(true); // 플레이어 로드
  };
  //======================================================================

  return (
    <div className="flex flex-col justify-start items-center absolute top-0 left-0 w-screen h-screen pb-[68px] lg:pb-0">
      <div className={styles.videoContainer}>
        {state.videoUrl !== '-' && (
          <img
            className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            onClick={() => setPlayerLoad(true)}
            src={`https://img.youtube.com/vi/${state.videoUrl}/0.jpg`}
            height="640"
            width="320"
            alt="thumbnail"
            placeholder="empty"
          />
        )}
        {countBeforeCheckPron > 0 && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center z-10 bg-[#000000bd]">
            <p className="text-8xl t text-white">{countBeforeCheckPron}</p>
          </div>
        )}
        {playerLoad && (
          <VideoContainer
            state={state}
            refs={playerRef}
            onReady={() => callbackRef.current?.func()}
            onEnd={addViewCount}
          />
        )}
      </div>
      <div className="w-full py-5 px-8 overflow-y-auto flex flex-col items-center ">
        <div className="relative w-full lg:w-[85%] rounded-lg bg-white shadow-custom py-6 px-8 flex flex-col md:flex-row justify-between max-w-[1024px]">
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
            <div className="hidden md:flex flex-col justify-between w-full pl-8 ml-8 border-l">
              <ViewDictionary word={searchWord} resetWord={resetWord} />
            </div>
          )}
        </div>
        {searchWord && (
          <div className="md:hidden shadow-custom mt-4 flex flex-col justify-between  py-6 px-8 relative w-full rounded-xl bg-white ">
            <ViewDictionary word={searchWord} resetWord={resetWord} />
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
