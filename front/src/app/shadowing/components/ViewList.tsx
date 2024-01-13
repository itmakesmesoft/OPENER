'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getShadowingList } from '@/app/api/shadowingApi';
import { BsBookmarkPlus, BsBookmarkPlusFill } from 'react-icons/bs';
import { listInterface } from '@/types/share';
import useSWRInfinite from 'swr/infinite';
import useUser from '@/app/hooks/userHook';

const ViewList = ({ category }: { category: string | undefined }) => {
  const { user } = useUser();

  const getKey = (pageIndex: number) => {
    const start = pageIndex * 10;
    const end = pageIndex * 10 + 9;
    if (category === '추천' && user.data.nickname) {
      return `/fast/recommendations/${user.data.nickname}/${start}/${end}`;
    } else if (category === '전체' || category === undefined) {
      return `/shadowings?startIndex=${start}&endIndex=${end}`; // SWR 키
    } else {
      return `/shadowings?startIndex=${start}&endIndex=${end}&category=${category}`; // SWR 키
    }
  };

  const { data, size, setSize } = useSWRInfinite(getKey, getShadowingList);

  return (
    <div className="flex flex-col my-2">
      {data?.map((list: listInterface[]) =>
        list.map((content: listInterface, index: number) => (
          <Link
            href={'/shadowing/learning/' + content.videoId}
            key={index}
            className="p-2 mb-3 rounded-lg w-full shadow-lg cursor-pointer bg-white flex flex-row justify-between items-center hover:bg-[#8120ff] active:bg-[#7115ea] hover:text-white hover:shadow-none box-border"
          >
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-row items-center mr-2 rounded-md min-w-[0px]">
                <Image
                  className="w-[100px] sm:w-[130px] lg:w-[160px] h-auto bg-gray-200 flex-none aspect-[3/2] object-cover"
                  src={content.thumbnailUrl}
                  width="360"
                  height="240"
                  blurDataURL="empty"
                  alt="thumbnail"
                />
                <div className="ml-3 lg:ml-5 min-w-[0px]">
                  <p className="text-md lg:text-xl font-medium mb-2 truncate">
                    {content.engSentence}
                  </p>
                  <p className="text-sm lg:text-md truncate">
                    {content.korSentence}
                  </p>
                </div>
              </div>
              <div className="p-3">
                {content.isMarked ? (
                  <BsBookmarkPlusFill color="#7D17FF" size="1.5rem" />
                ) : (
                  <BsBookmarkPlus color="#D9D9D9" size="1.5rem" />
                )}
              </div>
            </div>
          </Link>
        )),
      )}
      <button
        onClick={() => setSize(size + 1)}
        className="mt-2 border border-[#e3e3e3] p-3 bg-[#f0f0f0] w-full hover:bg-white active:bg-[#f0f0f0] hover:shadow-lg rounded-xl"
      >
        더 보기
      </button>
    </div>
  );
};

export default ViewList;
