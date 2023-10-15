import { searchWordType } from '@/types/share';

const ViewDictionary = (props: { word: searchWordType | null }) => {
  const wordInfo = props.word;
  if (wordInfo) {
    const meaning = wordInfo.meaning.split(',');
    return (
      <div className="lg:overflow-y-auto h-full">
        <p className="mb-5">
          <span className="text-lg font-semibold text-[#0B8AFF]">
            {wordInfo.word}
          </span>
          <span className="text-sm text-[#949494] ml-2">{wordInfo.level}</span>
        </p>
        <p className="mb-2 text-base text-[#949494]">{wordInfo.wordType}</p>
        {meaning.map((mean, index) => {
          return (
            <p className="mb-2" key={index}>
              {index + 1}. {mean}
            </p>
          );
        })}
      </div>
    );
  }
  return <></>;
};
export default ViewDictionary;
