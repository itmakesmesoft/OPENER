import { useState } from 'react';
import { captionType, searchWordType } from '@/types/share';

const CaptionComponent = (props: {
  isShowKorCap: boolean;
  caption: captionType | undefined;
  setSearchWord: (param: searchWordType | null) => void;
}) => {
  const reg = /[`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/gim;
  const [selected, setSelected] = useState<number | null>(null);
  const searchDict = async (w: string) => {
    const word = w.toLowerCase().replace(reg, '');
    props.setSearchWord({
      word: word,
      meaning: '예문',
      wordType: '단어',
      level: '쉬움',
    });
    // return await dictionaryApi(word).then((res) => {
    //   if (res.status === 200) {
    //     setSearchWord(res.data.data);
    //   }
    // });
  };

  return (
    <div className="mt-2 mb-5 min-h-[60px]">
      <div className="english_subtitle whitespace-pre-wrap">
        {props.caption?.eng?.split(' ').map((word: string, index: number) => {
          return (
            <span key={index}>
              <span
                onClick={() => {
                  setSelected(index);
                  searchDict(word);
                }}
                className={`${
                  selected === index
                    ? 'text-[#8224ca] font-semibold underline'
                    : ''
                } cursor-pointer hover:bg-[#e8e8e8]`}
              >
                {word}
              </span>{' '}
            </span>
          );
        })}
      </div>
      <div className="korean_subtitle">
        <p className="text-[#787878] text-sm">
          {props.isShowKorCap && props.caption?.kor}
        </p>
      </div>
    </div>
  );
};

export default CaptionComponent;
