'use client';
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
  PropertyId,
  PronunciationAssessmentConfig,
} from 'microsoft-cognitiveservices-speech-sdk';
import Chart from './Chart';
import { AiOutlinePause } from 'react-icons/ai';
import { BsChevronLeft, BsMic } from 'react-icons/bs';
import React, { useState, useRef, useEffect, MutableRefObject } from 'react';

const CheckDiction = (props: {
  playerRef: any;
  countDown: number;
  engCaption: string | undefined;
  showCountdownRef: MutableRefObject<boolean>;
  setCountDown: (param: number) => void;
  checkDiction: (param: boolean) => void;
}) => {
  const [assessmentResult, setAssessmentResult] = useState<any>();
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const backBtn = () => {
    props.checkDiction(false);
    props.showCountdownRef.current = false;
  };

  // Cognitive Services 계정 정보 <================================ 숨겨야함
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_API;
  const serviceRegion = 'eastus';
  const speechConfig = SpeechConfig.fromSubscription(
    subscriptionKey!,
    serviceRegion!,
  );
  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  let recognizer: SpeechRecognizer | undefined;
  const recognizerRef = useRef<SpeechRecognizer | undefined>(recognizer);
  let timer: any;
  const standByRecord = () => {
    // 3초 타이머
    setAssessmentResult(undefined);
    setIsRecording(true);
    let second = 3;
    timer = setInterval(() => {
      second -= 1;
      props.setCountDown(second);
      if (!props.showCountdownRef.current) {
        clearInterval(timer);
      } else if (second < 1) {
        Record();
        props.showCountdownRef.current = false;
        clearInterval(timer);
      }
    }, 1000);
  };

  useEffect(() => {
    standByRecord();
    return () => {
      clearInterval(timer); // timer 종료
      recognizerRef.current?.stopContinuousRecognitionAsync();
    };
  }, []);

  const Record = () => {
    props.playerRef.current.playVideo();
    const config = PronunciationAssessmentConfig.fromJSON(
      JSON.stringify({
        referenceText: props.engCaption,
        gradingSystem: 'HundredMark',
        granularity: 'Phoneme',
        phonemeAlphabet: 'IPA',
        nBestPhonemeCount: 5,
      }),
    );
    recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    config.applyTo(recognizer);
    recognizerRef.current = recognizer;

    recognizer.recognizing = (s, e) => {
      const list: any = [];
      e.result.text.split(' ').map((word, index) => {
        const info = {
          index: index,
          word: word,
          isPron: true,
          pronunciationAssessment: undefined, // 평가 전
        };
        list.push(info);
      });
      setAssessmentResult({
        aassessment: {},
        list: list,
      });
    };
    recognizer.recognized = (s, e) => {
      const res = e.result.properties.getProperty(
        PropertyId.SpeechServiceResponse_JsonResult,
      );
      if (recognizer) {
        result(JSON.parse(res));
        stopRecord();
      }
    };
    recognizer.sessionStopped = () => {
      if (recognizer) {
        recognizer.close();
        recognizer = undefined;
      }
    };
    recognizer.startContinuousRecognitionAsync();
  };

  const stopRecord = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      setIsRecording(false);
      props.showCountdownRef.current = false;
      props.playerRef.current?.playVideo();
    }
  };

  const checkCommonWords = (script: any, Lexical: any, res: any) => {
    // caption과 Lexical 비교 =>  최장공통부분수열 LCS(Longest Common Subsequence)
    // 1. 2차원 배열 초기화
    const reg = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gim;
    const caption = script.replace(reg, '');
    const n = caption.length;
    const m = Lexical.length;
    const arr = Array(n + 1)
      .fill(0)
      .map(() => Array(m + 1).fill(0));

    // 2. 2차원 배열 순회하며 비교 후 배열 채우기
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (caption[i - 1].toLowerCase() === Lexical[j - 1].toLowerCase()) {
          arr[i][j] = arr[i - 1][j - 1] + 1;
        } else {
          arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
        }
      }
    }
    // 3. 공통되는 부분 추적
    let i = n;
    let j = m;
    const resCaptionIdx: number[] = []; // caption 리스트에서 Lexical의 단어와 일치하는 단어를 담을 인덱스
    while (arr[i][j] > 0) {
      if (arr[i][j] === arr[i][j - 1]) {
        j -= 1;
      } else if (arr[i][j] === arr[i - 1][j]) {
        i -= 1;
      } else {
        resCaptionIdx.push(i - 1);
        i -= 1;
        j -= 1;
      }
    }
    const recognized = []; // 단어의 발음 정보를 담는 배열
    for (let i = 0; i < n; i++) {
      const info = {
        index: i,
        word: caption[i],
        isPron: false,
        pronunciationAssessment: undefined,
      };
      if (resCaptionIdx.includes(i)) {
        const word = res.Words.splice(0, 1)[0];
        info.isPron = true;
        info.pronunciationAssessment = word.PronunciationAssessment;
      }
      recognized.push(info);
    }
    const r = resCaptionIdx.length;
    const assessment = {
      accuracy: (res.PronunciationAssessment.AccuracyScore * r) / n,
      fluency: (res.PronunciationAssessment.FluencyScore * r) / n,
      completeness: (res.PronunciationAssessment.CompletenessScore * r) / n,
      pron: (res.PronunciationAssessment.PronScore * r) / n,
    };
    return [assessment, recognized];
  };

  const result = async (result: any) => {
    if (props.engCaption && result.RecognitionStatus === 'Success') {
      const res = result.NBest[0];
      const Lexical = res.Lexical.split(' ');
      const caption = props.engCaption.split(' ');
      const [assessment, recognized] = checkCommonWords(caption, Lexical, res);

      setAssessmentResult({
        assessment: assessment,
        list: recognized,
      }); // 발음 결과
    } else if (
      props.engCaption &&
      result.RecognitionStatus === 'EndOfDictation'
    ) {
      console.log('EndOfDictation');
    }
  };
  return (
    <div className="relative flex flex-col justify-between h-full">
      <div className="mb-4 min-h-[60px]">
        <p className="font-bold mb-2">{props.engCaption}</p>
        <p className="font-semibold">
          {assessmentResult?.list.map((caption: any, index: number) => {
            return (
              <span key={index}>
                <span>
                  {caption.isPron ||
                  caption.pronunciationAssessment?.AccuracyScore > 70 ? (
                    <span className="text-[#7adf70] cursor-pointer">
                      {caption.word}
                    </span>
                  ) : caption.isPron ||
                    caption.pronunciationAssessment?.AccuracyScore < 50 ? (
                    <span className="text-[#ff7142] cursor-pointer">
                      {caption.word}
                    </span>
                  ) : (
                    <span className="text-[#bbbbbb] cursor-pointer">
                      {caption.word}
                    </span>
                  )}
                </span>{' '}
              </span>
            );
          })}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mb-3">
        <div className="bg-[#fcfffb] rounded-md border border-[#e5e5e5] py-3 px-2 w-full">
          <p className="text-center font-semibold">발음 평가 결과</p>
          <div className="flex flex-row justify-center items-center">
            <div className="w-[100px] ">
              <Chart value={assessmentResult?.assessment?.pron} />
              <p className="text-center text-xs">발음 점수</p>
            </div>
            <div className="w-[70px] ">
              <Chart value={assessmentResult?.assessment?.accuracy} />
              <p className="text-center text-xs">정확성</p>
            </div>
            <div className="w-[70px] ">
              <Chart value={assessmentResult?.assessment?.fluency} />
              <p className="text-center text-xs">유창성</p>
            </div>
            <div className="w-[70px] ">
              <Chart value={assessmentResult?.assessment?.completeness} />
              <p className="text-center text-xs">완성도</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-end justify-between">
        <div className="w-full">
          <button
            className="rounded-full p-2 bg-[#F0F0F0] hover:bg-[#f7f7f7] active:bg-[#f1f1f1]"
            onClick={backBtn}
          >
            <BsChevronLeft />
          </button>
        </div>
        <div className="w-full flex flex-col items-center">
          {isRecording ? (
            <button
              onClick={stopRecord}
              className="rounded-full bg-[#F0F0F0] hover:bg-[#f7f7f7] active:bg-[#f1f1f1] p-4"
            >
              <AiOutlinePause size={'2rem'} />
            </button>
          ) : (
            <button
              onClick={standByRecord}
              className="rounded-full bg-[#F0F0F0] hover:bg-[#f7f7f7] active:bg-[#f1f1f1] p-4"
            >
              <BsMic size={'2rem'} />
            </button>
          )}
        </div>
        <div className="w-full" />
      </div>
    </div>
  );
};

export default CheckDiction;
