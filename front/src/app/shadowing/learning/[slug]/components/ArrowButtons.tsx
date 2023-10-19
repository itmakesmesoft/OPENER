import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
const ArrowButtons = (props: {
  prevCaption: () => void;
  nextCaption: () => void;
}) => {
  return (
    <div className="flex flex-row justify-between ">
      <button
        className="p-2 absolute top-0 left-[-2rem] h-full"
        onClick={props.prevCaption}
        aria-label="이전 자막으로 가기"
      >
        <BsChevronLeft />
      </button>
      <button
        className="p-2 absolute top-0 right-[-2rem] h-full"
        onClick={props.nextCaption}
        aria-label="다음 자막으로 가기"
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default ArrowButtons;
