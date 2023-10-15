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
      >
        <BsChevronLeft />
      </button>
      <button
        className="p-2 absolute top-0 right-[-2rem] h-full"
        onClick={props.nextCaption}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default ArrowButtons;
