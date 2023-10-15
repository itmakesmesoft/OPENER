import {
  BsMic,
  BsBookmarkPlus,
  BsBookmarkPlusFill,
  BsArrowRepeat,
} from 'react-icons/bs';
import { stateType } from '@/types/share';

const FooterButtons = (props: {
  state: stateType;
  bookMark: () => void;
  checkRepeat: () => void;
  checkDiction: (param: boolean) => void;
}) => {
  const state = props.state;
  return (
    <div className="flex flex-row justify-between items-center">
      <button
        className="rounded-full p-2 bg-[#EFEFEF] hover:bg-[#f7f7f7] active:bg-[#f1f1f1]"
        onClick={() => {
          props.checkDiction(true);
        }}
      >
        <BsMic />
      </button>
      <div>
        <button
          onClick={props.bookMark}
          className={
            state.marked
              ? 'rounded-full p-2 bg-brandP hover:bg-[#8e38ff] active:bg-[#6110ca]'
              : 'rounded-full p-2 bg-[#EFEFEF] hover:bg-[#f7f7f7] active:bg-[#f1f1f1]'
          }
        >
          {state.marked ? (
            <BsBookmarkPlusFill color="white" />
          ) : (
            <BsBookmarkPlus />
          )}
        </button>
        <button
          onClick={props.checkRepeat}
          className={
            state.repeat
              ? 'rounded-full p-2 ml-2 bg-brandP hover:bg-[#8e38ff] active:bg-[#6110ca]'
              : 'rounded-full p-2 ml-2 bg-[#EFEFEF] hover:bg-[#f7f7f7] active:bg-[#f1f1f1]'
          }
        >
          {state.repeat ? <BsArrowRepeat color="white" /> : <BsArrowRepeat />}
        </button>
        <div className="inline-block rounded-2xl bg-[#EFEFEF] h-[32px] py-1 px-2 align-baseline ml-2">
          {state.views}/20
        </div>
      </div>
    </div>
  );
};
export default FooterButtons;
