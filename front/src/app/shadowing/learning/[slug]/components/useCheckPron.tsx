'use client';
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
  PropertyId,
  PronunciationAssessmentConfig,
} from 'microsoft-cognitiveservices-speech-sdk';
import Chart from './chart';
import React, { useState, useRef, useEffect } from 'react';

const useCheckPron = (engCaption: string | undefined) => {
  const [assessmentResult, setAssessmentResult] = useState<any>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognizerRef = useRef<SpeechRecognizer | undefined>();
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_API || '';
  const [isOpenEvaluation, setIsOpenEvaluation] = useState<boolean>(false); // 발음 평가 켜기 => true/false
  const serviceRegion = 'eastus';

  const stopRecord = () => {
    recognizerRef.current?.stopContinuousRecognitionAsync();
    timer.current && clearInterval(timer.current);
    timer.current = null;
    setAssessmentResult(undefined);
    setIsRecording(false);
    setCount(0);
    console.log('request : stop record');
  };

  // const closeCheck = () => {
  //   setAssessmentResult(undefined);
  //   stopRecord();
  // };

  const timer = useRef<NodeJS.Timer | null>(null);
  const [count, setCount] = useState<number>(0);

  const standByRecord = () => {
    console.log('request : standby');
    setIsOpenEvaluation(true);
    if (!timer.current) {
      // openEvaluatePron();
      setIsRecording(true);
      setCount(3);
      let time = 3;
      timer.current = setInterval(() => {
        time -= 1;
        setCount(time);
        if (time === 0) {
          Record();
          timer.current && clearInterval(timer.current);
        }
      }, 1000);
    } else {
      stopRecord();
    }
  };

  useEffect(() => {
    return () => {
      console.log('response : unmounted');
      stopRecord();
    };
  }, []);

  const Record = () => {
    console.log('request : start record');
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const config = PronunciationAssessmentConfig.fromJSON(
      JSON.stringify({
        referenceText: engCaption,
        gradingSystem: 'HundredMark',
        granularity: 'Phoneme',
        phonemeAlphabet: 'IPA',
        nBestPhonemeCount: 5,
      }),
    );

    const speechConfig = SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion,
    );
    recognizerRef.current = new SpeechRecognizer(speechConfig, audioConfig);
    config.applyTo(recognizerRef.current);

    recognizerRef.current.recognizing = (s, e) => {
      console.log('response : recognizing');
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
    recognizerRef.current.recognized = (s, e) => {
      console.log('response : recognized');
      const res = e.result.properties.getProperty(
        PropertyId.SpeechServiceResponse_JsonResult,
      );
      if (recognizerRef.current) {
        result(JSON.parse(res));
        stopRecord();
      }
    };
    recognizerRef.current.canceled = () => {
      stopRecord();
      // alert('Azure API 토큰의 만료로 현재 사용할 수 없는 서비스입니다.');
    };
    recognizerRef.current.sessionStopped = () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
        recognizerRef.current = undefined;
        console.log('response : sessionStopped');
      }
    };
    recognizerRef.current.startContinuousRecognitionAsync();
    console.log('request : startContinuousRecognitionAsync');
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
    if (engCaption && result.RecognitionStatus === 'Success') {
      const res = result.NBest[0];
      const Lexical = res.Lexical.split(' ');
      const caption = engCaption.split(' ');
      const [assessment, recognized] = checkCommonWords(caption, Lexical, res);

      setAssessmentResult({
        assessment: assessment,
        list: recognized,
      }); // 발음 결과
    } else if (engCaption && result.RecognitionStatus === 'EndOfDictation') {
      console.log('EndOfDictation');
    }
  };

  const renderCheckPron = () => (
    <div className="mb-4 min-h-[60px]">
      <p className="font-bold mb-2">{engCaption}</p>
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
  );
  const renderResultPron = () => (
    <div className="flex flex-col justify-center items-center mb-3">
      <div className="bg-[#fcfcfc] rounded-md border border-[#e5e5e5] py-3 px-2 w-full">
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
  );

  return {
    count,
    startRecord: standByRecord,
    stopRecord,
    isRecording,
    renderCheckPron,
    renderResultPron,
    isOpenEvaluation,
    setIsOpenEvaluation,
  };
};

export default useCheckPron;
