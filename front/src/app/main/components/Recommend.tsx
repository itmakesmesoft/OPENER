'use client';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import React, { useState, useEffect } from 'react';
import { mainRecommendInterface } from '@/types/share';
import { getRecommendListApi } from '@/app/api/shadowingApi';

const Recommended = () => {
  const [data, setData] = useState<mainRecommendInterface[]>();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const getRecommendList = async () => {
    return await getRecommendListApi();
  };

  useEffect(() => {
    getRecommendList().then((res) => setData(res));
    console.log(data);
  }, []);

  return (
    <div className="mt-6 lg:mt-10 bg-white rounded-3xl shadow-lg overflow-hidden px-3 pt-5 lg:px-5 pb-10">
      <div className="relative flex flex-col justify-center mb-3">
        <h1 className="text-lg font-bold text-center">추천 문장</h1>
        <div className="absolute right-0 top-0 mr-2 h-full flex flex-col justify-center">
          <Link href={'/shadowing'} className="text-sm">
            더 보기
          </Link>
        </div>
      </div>
      <Slider {...settings}>
        {data?.map((content: mainRecommendInterface, index: number) => (
          <div key={index}>
            <Link href={'/shadowing/learning/' + content.videoId}>
              <div className="bg-white p-2 rounded-2xl hover:bg-[#f7f7f7]">
                {content.thumbnailUrl && (
                  <Image
                    src={content.thumbnailUrl}
                    alt="thumbnail"
                    width={360}
                    height={240}
                    className="rounded-xl shadow-md"
                  />
                )}
                <div className="mt-2 p-1 lg:mt-4 lg:p-1">
                  <p className="text-base font-semibold mb-1 lg:text-base lg:font-semibold lg:mb-1">
                    {content.engSentence}
                  </p>
                  <p className="text-sm font-light lg:text-sm lg:font-light">
                    {content.korSentence}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Recommended;

// export async function fetchData() {
//   const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
//   const res = await fetch(`${BASE_URL}shadowing-service/main-recommendation`, {
//     next: { revalidate: 10 },
//   });
//   const data = await res.json();
//   return data.data;
// }
