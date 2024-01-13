import { getSession } from 'next-auth/react';
import styles from './scrollbar.module.css';
import Link from 'next/link';
import PersonalCat from './PersonalCat';

const CatComponent = ({ category }: { category: string | undefined }) => {
  const categories = [
    '음악',
    '영화',
    '여행',
    '음식',
    '일상',
    '스포츠',
    '비즈니스',
    '애니메이션',
  ];

  if (category === undefined) category = '전체';
  return (
    <ul
      className={`flex flex-row py-2 overflow-x-auto overflow-y-hidden ${styles.scrollbar_hidden}`}
    >
      <Link
        className={`cursor-pointer text-sm mr-2 py-1 px-5 rounded-full whitespace-nowrap shadow-md hover:text-white hover:bg-[#8120ff] active:bg-[#7115ea] ${
          category === '전체' ? 'text-white bg-[#7115ea]' : 'bg-[#fff] '
        }`}
        href={{
          pathname: `/shadowing`, // 라우팅 id
          query: { category: '전체' }, // props
        }}
        as={`/shadowing?category=전체`}
      >
        전체
      </Link>
      <PersonalCat category={category} />
      {categories.map((cat: string, index: number) => {
        return (
          <Link
            key={index}
            className={`cursor-pointer text-sm mr-2 py-1 px-5 rounded-full whitespace-nowrap shadow-md hover:text-white hover:bg-[#8120ff] active:bg-[#7115ea] ${
              cat === category ? 'text-white bg-[#7115ea]' : 'bg-[#fff] '
            }`}
            href={{
              pathname: `/shadowing`, // 라우팅 id
              query: { category: cat }, // props
            }}
            as={`/shadowing?category=${cat}`}
          >
            {cat}
          </Link>
        );
      })}
    </ul>
  );
};
export default CatComponent;
