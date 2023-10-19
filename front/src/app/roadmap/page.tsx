'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRoadMapApi } from '../api/shadowingApi';
import { BiLockAlt } from 'react-icons/bi';
import { RiCheckFill } from 'react-icons/ri';
import {
  sentenceInterface,
  stepInterface,
  themeInterface,
} from '@/types/share';

const page = () => {
  const [data, setData] = useState<stepInterface[] | undefined>();

  const getRoadmap = async () => {
    return await getRoadMapApi();
  };

  const changeDataStructure = (data: any) => {
    // 1. 복잡한 객체 내부 키 이름 변경
    const newData = data.map((step: any) => {
      const stepList =
        step.themeRoadMapResponseDtoList ||
        step.authThemeRoadMapResponseDtoList;
      const newStepList = stepList.map((theme: any) => {
        const themeList =
          theme.roadMapResponseDtoList || theme.authRoadMapResponseDtoList;
        return { stepTheme: theme.stepTheme, list: themeList };
      });
      return { stepNo: step.stepNo, list: newStepList };
    });

    // 2. 모든 step.isLocked과 theme.isLocked의 기본값을 true로 지정
    newData.forEach((step: stepInterface) => {
      step.list.forEach((theme: themeInterface) => (theme['isLocked'] = true));
      step['isLocked'] = true;
    });
    return newData;
  };

  const getLastUnlockedTheme = (data: stepInterface[]) => {
    // 락이 풀리는 시점 찾기
    for (const step of data) {
      step.isLocked = false;
      for (const theme of step.list) {
        theme.isLocked = false;
        for (const sentence of theme.list)
          if (!sentence.statusDate) return data;
      }
    }
    return data;
  };

  useEffect(() => {
    getRoadmap()
      .then((res) => changeDataStructure(res))
      .then((res) => getLastUnlockedTheme(res))
      .then((data) => setData(data));
  }, []);

  return (
    <div className="inner-content">
      {data?.map((step: stepInterface, index: number) => (
        <div key={index}>
          <p className="text-center text-xl sm:text-2xl lg:text-3xl my-10 lg:mb-3 lg:mt-10">
            STEP {step.stepNo}
          </p>
          {step.list.map((theme: themeInterface, index: number) => (
            <div key={index} className="flex flex-row">
              <div className="w-[50px] flex flex-col items-center">
                {theme.isLocked ? (
                  <div className="h-[26px] w-[26px] m-[12px] rounded-full flex justify-center items-center bg-[#6713D4]">
                    <BiLockAlt color="#fff" />
                  </div>
                ) : (
                  <div className="h-[26px] w-[26px] m-[12px] rounded-full flex justify-center items-center border-2 border-[#4b4b4b]"></div>
                )}

                <div className="h-[calc(100%-50px)] w-[3px] bg-[#F0F0F0] rounded"></div>
              </div>
              <div className="w-[calc(100%-60px)]">
                <p className="text-md sm:text-lg mb-5 mt-[12px] pl-2">
                  {theme.stepTheme}
                </p>
                <div>
                  {!theme.isLocked &&
                    theme.list.map(
                      (sentence: sentenceInterface, index: number) => (
                        <Link
                          key={index}
                          href={'/shadowing/learning/' + sentence.videoId}
                          className="flex flex-row justify-between items-center w-full rounded-3xl shadow-md mb-4 py-6 px-8 bg-white hover:bg-[#F6F6F6] active:bg-[#F2F2F2]"
                        >
                          <div>
                            <p className="text-md sm:text-lg font-medium mb-2">
                              {sentence.engSentence}
                            </p>
                            <p className="text-xs sm:text-sm">
                              {sentence.korSentence}
                            </p>
                          </div>
                          {sentence.statusDate === '' ||
                          sentence.statusDate === null ||
                          sentence.statusDate === undefined ? (
                            <div className="w-[30px] h-[30px] rounded-full bg-[#F1F1F1]" />
                          ) : (
                            <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#FFD600]">
                              <RiCheckFill size="1.7rem" color="#ffffff" />
                            </div>
                          )}
                        </Link>
                      ),
                    )}
                  {theme.isLocked &&
                    theme.list.map((_, index: number) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between items-center w-full rounded-3xl shadow-md mb-4 py-6 px-8 bg-[#ffffff]"
                      >
                        <p className="text-xl font-medium mb-2 text-[#979797]">
                          Locked
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default page;
