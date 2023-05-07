// type sentenceType = {
//   video_id: string;
//   eng_sentence: string;
//   kor_sentence: string;
//   step_theme: string;
//   sentence_no: string;
//   status_date: string;
// };

// type themeType = {
//   step_theme: string;
//   list: sentenceType[];
// };

// type stepType = {
//   data: {
//     step_no: string;
//     list: themeType[];
//   };
// };
import { stepInterface } from '@/types/share';
import Theme from './Theme';
const Step = ({ data }: { data: stepInterface }) => {
  return (
    <>
      <p className="text-center text-2xl my-10 lg:mb-3 lg:mt-10 sm:text-3xl lg:text-4xl">
        STEP {data.step_no}
      </p>
      {data.list.map((theme, index) => {
        return <Theme data={theme} key={index} />;
      })}
    </>
  );
};

export default Step;
