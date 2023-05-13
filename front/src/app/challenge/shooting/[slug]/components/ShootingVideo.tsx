'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import YouTube, { YouTubeProps } from 'react-youtube';
import Button from '@/app/components/Button';
import { getSession } from 'next-auth/react';
import { uploadChallenge } from '@/app/api/challengeApi';

type Props = {
  originalId: number;
};

const ShootingVideo = ({ originalId }: Props) => {
  const [challengeFile, setChallengeFile] = useState<Blob>();
  const thumbnail = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [thumbImg, setThumbImg] = useState<string>('');
  const formData = new FormData();
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const uploadClick = async () => {
    const session = await getSession();
    const nickname = session?.user.user?.data.nickname;

    if (recordingPlayer.current && thumbCanvas.current && challengeFile) {
      const myFile = new File([challengeFile], 'demo.webm', {
        type: 'video/webm',
      });
      const blob = await fetch(thumbImg).then((res) => res.blob()); // 이미지 데이터를 multipart 형식으로 변환
      formData.append('memberChallengeImg', blob);
      formData.append('memberChallengeFile', myFile);
      formData.append('nicknasme', nickname || '');
      const res = await uploadChallenge(originalId, formData);
      if (res.code === 200) {
        alert('영상 공유를 성공하였습니다.');
        router.push('/challenge');
      }
    }
  };

  // --------------------------------------- youtube
  const youtubeRecordRef = useRef<YouTube>(null); // 촬영할 때의 원본 화면
  const youtubePlayRef = useRef<YouTube>(null); // 실행할 때의 원본 화면

  const onRecordReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const onPlayReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '224',
    width: '126',
    playerVars: {
      controls: 0,
      loop: 1,
      disablekb: 1,
      autohide: 0,
      autoplay: 0,
      fs: 0,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  const recordingStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      stopRecording();
    }
    if (event.data === YouTube.PlayerState.PAUSED) {
      stopRecording();
      alert('영상 촬영이 중단되었습니다.');
      window.location.reload();
    }
  };
  const playingStateChange = (event: any) => {
    // 유튜브랑 싱크 맞추기 위해서 사용
    if (event.data === YouTube.PlayerState.ENDED) {
      if (youtubePlayRef.current) {
        const player = youtubePlayRef.current?.internalPlayer;
        player.playVideo();
        if (recordingPlayer.current) {
          recordingPlayer.current.pause();
          recordingPlayer.current.load();
        }
      }
    }
    if (event.data === YouTube.PlayerState.PLAYING) {
      if (recordingPlayer.current) {
        recordingPlayer.current.play();
      }
    }
    if (event.data === YouTube.PlayerState.PAUSED) {
      if (recordingPlayer.current) {
        recordingPlayer.current.pause();
      }
    }
  };

  const videoStyle = {
    // borderRadius: '10px', // 가장자리 둥글게 만들기
    // overflow: 'hidden', // 둥글게 만든 가장자리 넘치는 부분 잘라내기 -- 하얗게 보이는 버그있음
    // backgroundColor: 'transparent',
    height: '100%',
  };
  // =========================================

  const [isPreview, setIsPreview] = useState(false); // false
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [isRec, setIsRec] = useState(false);
  const recorderRef = useRef<MediaRecorder>();
  const downloadButton = useRef<HTMLAnchorElement>(null);
  const previewPlayer = useRef<HTMLVideoElement>(null);
  const recordingPlayer = useRef<HTMLVideoElement>(null);
  const thumbCanvas = useRef<HTMLCanvasElement>(null);

  const videoStart = () => {
    // 컴포넌트 들어왔을 때 촬영 대기
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 480,
          height: 853,
        },
        audio: false,
      })
      .then((stream: MediaStream) => {
        if (previewPlayer.current) {
          previewPlayer.current.srcObject = stream;
          setLoadingDone(true);
        }
      });
  };

  const startRecording = (stream: MediaStream) => {
    // 영상 촬영 시작
    const player = youtubeRecordRef.current?.internalPlayer;
    setIsRec(true);
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      setRecordedChunks([...recordedChunks, e.data]);
    };
    recorder.start();
    player.playVideo();
  };

  const stopRecording = () => {
    if (previewPlayer.current && previewPlayer.current.srcObject) {
      const srcObj = previewPlayer.current.srcObject;
      if ('getTracks' in srcObj) {
        srcObj
          .getTracks()
          .forEach((track: { stop: () => any }) => track.stop());
        // console.log(srcObj.getTracks());
      }
    }
    recorderRef.current?.stop();
    setIsPreview(true);
  };

  // const playRecording = () => {
  //   const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
  //   console.log('recordedBlob:', recordedBlob);
  //   console.log('recordedChunks:', recordedChunks);
  //   if (recordingPlayer.current) {
  //     recordingPlayer.current.src = URL.createObjectURL(recordedBlob);
  //     recordingPlayer.current.play();
  //     if (downloadButton.current) {
  //       downloadButton.current.href = recordingPlayer.current.src;
  //       downloadButton.current.download = `recording_${new Date()}.webm`;
  //       console.log(recordingPlayer.current.src);
  //     }
  //   }
  // };

  useEffect(() => {
    // 컴포넌트 실행시 촬영 대기 시작
    videoStart();
  }, []);

  useEffect(() => {
    // 촬영 영상 실행 준비되면 유튜브 플레이
    if (youtubePlayRef.current) {
      const player = youtubePlayRef.current?.internalPlayer;
      player.playVideo();
    }
  }, [onPlayReady]);

  // recordedChunks 입력되면 바로 영상 출력 준비 완료.
  useEffect(() => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    if (recordingPlayer.current) {
      recordingPlayer.current.src = URL.createObjectURL(recordedBlob);
      setChallengeFile(recordedBlob); // 영상 변수에 저장
      setTimeout(() => {
        if (thumbCanvas.current && recordingPlayer.current) {
          thumbCanvas.current.width = recordingPlayer.current.videoWidth;
          thumbCanvas.current.height = recordingPlayer.current.videoHeight;
          const cavasCtx = thumbCanvas.current.getContext('2d');
          recordingPlayer.current.currentTime = 1;
          if (cavasCtx) {
            cavasCtx.drawImage(
              recordingPlayer.current,
              0,
              0,
              recordingPlayer.current.videoWidth,
              recordingPlayer.current.videoHeight,
            );
            const imageData = cavasCtx.canvas.toDataURL();
            setThumbImg(imageData);
          }
        }
      }, 50);
      if (downloadButton.current) {
        downloadButton.current.href = recordingPlayer.current.src;
        downloadButton.current.download = `recording_${new Date()}.webm`;
      }
    }
  }, [recordedChunks]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-center relative">
        {!isPreview && (
          <>
            <div className={isPreview ? 'hidden' : 'relative'}>
              <video className="" autoPlay muted ref={previewPlayer}></video>
              <div className="absolute bottom-0 left-0 ml-2 mb-2">
                <YouTube
                  style={videoStyle}
                  videoId="Wb7dDxDNvtc"
                  opts={opts}
                  onReady={onRecordReady}
                  ref={youtubeRecordRef}
                  onStateChange={recordingStateChange}
                  className={isRec ? '' : 'hidden'}
                />
              </div>
            </div>
            <div className={loadingDone ? 'absolute bottom-0' : 'hidden'}>
              <button
                className={isRec ? 'hidden' : ''}
                onClick={() => {
                  startRecording(
                    (previewPlayer.current as any).captureStream(),
                  );
                }}
              >
                <img
                  src="/start.svg"
                  alt=".."
                  className=""
                  width={100}
                  height={100}
                />
              </button>
            </div>
          </>
        )}
        {isPreview && (
          <>
            <div className={isPreview ? 'relative' : 'hidden'}>
              <video ref={recordingPlayer}></video>
              <canvas ref={thumbCanvas} className="hidden"></canvas>
              <img ref={thumbnail} />
              <div className="absolute bottom-0 left-0 ml-2 mb-2">
                <YouTube
                  videoId="Wb7dDxDNvtc"
                  opts={opts}
                  onReady={onPlayReady}
                  ref={youtubePlayRef}
                  onStateChange={playingStateChange}
                />
              </div>
              <div className="absolute bottom-0 right-0 mr-2 mb-10">
                <Button
                  type="button"
                  text="공유하기"
                  className=" bg-brandP w-32 text-white rounded-xl shadow-xl py-3"
                  onClick={uploadClick}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShootingVideo;