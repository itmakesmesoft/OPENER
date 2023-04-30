import ProfileImage from '@/app/components/ProfileImage';
import Link from 'next/link';
import { AiOutlineLogout, AiOutlineSetting } from 'react-icons/ai';

const dummy = ['여행', '일상'];

const MypageTopSection = () => {
  return (
    <div className="h-[200px] flex px-10 py-12">
      <div className="mr-10 max-w-[100px]">
        <ProfileImage
          className="w-full h-full"
          width={500}
          height={500}
          profileUrl="/images/ai.png"
        />
      </div>
      <div className="w-full relative">
        <div className="text-xl">
          <span className="font-bold">닉네임</span> 님
        </div>
        <div>ssafy@ssafy.com</div>
        <div className="flex justify-between absolute bottom-0 left-0 right-0 items-end">
          <div className="space-x-2 text-xs">
            {dummy.map((item, idx) => (
              <span key={idx} className="bg-gray-200 p-1 rounded-xl">
                {item}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <Link
              href="/mypage/edit"
              className="bg-gray-300 p-1 text-2xl rounded-full"
            >
              <AiOutlineSetting className="fill-white" />
            </Link>
            <button
              type="button"
              className="bg-gray-300 p-1 text-2xl rounded-full"
            >
              <AiOutlineLogout className="fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageTopSection;
