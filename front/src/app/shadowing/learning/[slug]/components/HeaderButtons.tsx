import Switch from '@mui/material/Switch';

const HeaderButtons = (props: {
  setPlayerSpeed: () => void;
  setIsShownKorean: (param: boolean) => void;
  isShownKorean: boolean;
  speed: number;
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <button
        className="h-[2rem] rounded-2xl border w-[4rem] hover:bg-[#f7f7f7] active:bg-[#f1f1f1]"
        onClick={props.setPlayerSpeed}
      >
        {props.speed}x
      </button>
      <div className="flex flex-row items-center">
        <span className="text-sm text-[#787878]">한글 자막</span>
        <Switch
          checked={props.isShownKorean}
          onChange={() => {
            props.setIsShownKorean(!props.isShownKorean);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
          color="secondary"
        />
      </div>
    </div>
  );
};

export default HeaderButtons;
