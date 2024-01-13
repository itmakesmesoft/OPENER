'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

const categories: string[] = ['추천', '북마크'];

const PersonalCat = ({ category }: { category: string }) => {
  const { data: session } = useSession();
  if (!session) return <></>;
  return (
    <>
      {categories.map((cat: string, index) => (
        <Link
          key={`${cat}-${index}`}
          className={`cursor-pointer text-sm mr-2 py-1 px-5 rounded-full whitespace-nowrap shadow-md hover:text-white hover:bg-[#8120ff] active:bg-[#7115ea] ${
            category === cat ? 'text-white bg-[#7115ea]' : 'bg-[#fff] '
          }`}
          href={{
            pathname: `/shadowing`, // 라우팅 id
            query: { category: cat }, // props
          }}
          as={`/shadowing?category=${cat}`}
        >
          {cat}
        </Link>
      ))}
    </>
  );
};

export default PersonalCat;
