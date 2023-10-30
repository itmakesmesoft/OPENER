import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
const ArrowButtons = (props: {
  prevCaption: () => void;
  nextCaption: () => void;
}) => {
  return (
    <>
      <button
        className="absolute top-0 left-0 h-full p-2 rounded hover:bg-[#f7f7f7]"
        onClick={props.prevCaption}
        aria-label="이전 자막으로 가기"
      >
        <BsChevronLeft />
      </button>
      <button
        className="absolute top-0 right-0 h-full p-2 rounded hover:bg-[#f7f7f7]"
        onClick={props.nextCaption}
        aria-label="다음 자막으로 가기"
      >
        <BsChevronRight />
      </button>
    </>
  );
};

export default ArrowButtons;
