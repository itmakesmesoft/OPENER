'use client';
import { getMainRoadMapApi } from '@/app/api/shadowingApi';
import Link from 'next/link';
import { RiCheckFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { mainRoadmapInterface } from '@/types/share';

const Roadmap = () => {
  const [data, setData] = useState<mainRoadmapInterface[]>();
  const getRoadmap = async () => {
    return await getMainRoadMapApi();
  };

  useEffect(() => {
    getRoadmap().then((res) => setData(res));
  }, []);

  return (
    <div className="w-full h-full">
      <div className="shadow-custom min-h-[160px] flex flex-col lg:flex-row justify-around rounded-3xl py-5 px-2 lg:py-8 sm:px-10 bg-white">
        <p className="lg:text-xl text-center text-lg font-bold mb-3 w-full flex flex-col justify-center ">
          학습 로드맵
        </p>
        {data?.map((content, index) => {
          return (
            <Link
              href={'/shadowing/learning/' + content.videoId}
              key={index}
              className="flex flex-row lg:flex-col-reverse lg:justify-end justify-between items-center w-full py-3 px-6 hover:bg-[#f7f7f7] rounded-xl"
            >
              <div className="lg:mt-3">
                <p className="text-start text-lg font-semibold">
                  {content.engSentence}
                </p>
                <p className="text-start text-sm">{content.korSentence}</p>
              </div>
              {content.status_date ? (
                <div className="p-1 rounded-full bg-[#FFD600]">
                  <RiCheckFill size="1.3rem" color="#ffffff" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-[#F1F1F1]">
                  <RiCheckFill size="1.3rem" color="#ffffff" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
