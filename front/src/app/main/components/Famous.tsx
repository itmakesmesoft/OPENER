'use client';
import React, { useState, useEffect } from 'react';
import { allChallengeApi } from '@/app/api/challengeApi';
import { memberChallenge } from '@/types/share';
import { AiFillHeart } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';

const Famous = () => {
  const [contents, setContents] = useState<memberChallenge[]>([]);

  useEffect(() => {
    const getContent = async () => {
      const response = await allChallengeApi('LIKE', 0, 5);
      console.log(response);
      setContents(response.memberChallengeList);
    };
    getContent();
  }, []);

  return (
    <div className="pb-4 mt-6 lg:mt-10">
      <h1 className="text-lg lg:mb-3 ml-4 font-bold">인기 챌린지</h1>
      <div className="relative">
        <div className="lg:hidden p_scrollbar_right" />
        <div className="flex flex-row relative justify-between p-4">
          {contents.map((content: any, index: number) => {
            return (
              <Link
                key={index}
                href={`/challenge/scroll/LIKE/${index}`}
                className="shadow-custom lg:mr-0 mr-2 bg-[#4b4b4b] rounded-3xl hover:shadow-customhover"
              >
                <div className="relative w-[110px] h-[195.5px] sm:w-[130px] sm:h-[230px] lg:w-[155px] lg:h-[275.5px] overflow-hidden rounded-3xl">
                  <Image
                    src={content.memberChallengeImg}
                    alt=""
                    width={360}
                    height={640}
                  />
                  <div className="absolute inset-x-0 bottom-2 left-3 h-8 flex text-[#ffffffc1] items-center">
                    <AiFillHeart
                      size={'1.4rem'}
                      className="fill-[#ffffffc1] mr-2"
                    />
                    <p>{content.likeCount}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Famous;
