'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './scrollbar.module.css';

const useCategory = () => {
  const { data: session } = useSession();
  const categories = [
    '전체',
    '추천',
    '북마크',
    '음악',
    '영화',
    '여행',
    '음식',
    '일상',
    '스포츠',
    '비즈니스',
    '애니메이션',
  ];
  if (!session) categories.splice(1, 2); // 세션이 존재하지 않는 경우 추천탭과 북마크탭 제거
  const [selected, setSelected] = useState<number>(0);

  const CatComponent = () => (
    <ul
      className={`flex flex-row py-2 overflow-x-auto overflow-y-hidden ${styles.scrollbar_hidden}`}
    >
      {categories.map((category: string, index: number) => {
        return (
          <li
            key={index}
            className={`cursor-pointer text-sm mr-2 py-1 px-5 rounded-full whitespace-nowrap shadow-md hover:text-white hover:bg-[#8120ff] active:bg-[#7115ea] ${
              selected === index ? 'text-white bg-[#7115ea]' : 'bg-[#fff] '
            }`}
            onClick={() => setSelected(index)}
          >
            {category}
          </li>
        );
      })}
    </ul>
  );
  return { CatComponent, category: categories[selected] };
};
export default useCategory;
