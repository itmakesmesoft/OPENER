import { dictionaryApi } from '@/app/api/shadowingApi';
import { TfiClose } from 'react-icons/tfi';

const ViewDictionary = (props: {
  word?: string | undefined;
  closeDict?: () => void;
}) => {
  const reg = /[`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/gim;
  const getMeaningWord = async (word: string) => {
    return await dictionaryApi(word).then((res) => res.data);
  };

  let wordInfo;
  if (props.word) {
    wordInfo = {
      word: props.word.toLowerCase().replace(reg, ''),
      meaning: [
        '의미 하나',
        '의미 둘',
        '의미 셋',
        '의미 넷',
        '의미 하나',
        '의미 둘',
        '의미 셋',
        '의미 넷',
      ],
      wordType: '명사',
      level: '쉬움',
    };
  }

  // const meaning = wordInfo.meaning.split(',');

  if (!wordInfo) return <></>;
  return (
    <div className="relative h-full">
      <button
        onClick={props.closeDict}
        className="absolute top-0 right-0 p-2 rounded-full hover:bg-[#f7f7f7]"
        aria-label="사전 닫기"
      >
        <TfiClose />
      </button>
      <p className="mb-5">
        <span className="text-lg font-semibold text-[#0B8AFF]">
          {wordInfo.word}
        </span>
        <span className="text-sm text-[#949494] ml-2">{wordInfo.level}</span>
      </p>
      <div className="h-full md:max-h-[calc(100%-50px)] overflow-y-auto">
        <p className="mb-2 text-base text-[#949494]">{wordInfo.wordType}</p>
        {wordInfo.meaning.map((mean: string, index: number) => {
          return (
            <p className="mb-2" key={index}>
              {index + 1}. {mean}
            </p>
          );
        })}
      </div>
    </div>
  );
};
export default ViewDictionary;
