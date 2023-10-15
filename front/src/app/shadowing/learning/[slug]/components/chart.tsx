import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type chartProps = {
  value: string;
};

const Chart = ({ value = '0' }: chartProps) => {
  const val: number = parseInt(value);
  return (
    <div className="relative m-2">
      <CircularProgressbar
        value={val}
        text={`${val}%`}
        styles={{
          // Customize the root svg element
          root: {},
          // Customize the path, i.e. the "completed progress"
          path: {
            // Path color
            stroke: '#7D17FF',
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',
            // Customize transition animation
            transition: 'stroke-dashoffset 0.5s ease 0s',
          },
          // Customize the circle behind the path, i.e. the "total progress"
          trail: {
            // Trail color
            stroke: '#DDDDDD',
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',
            // Rotate the trail
            transform: 'rotate(0.25turn)',
            transformOrigin: 'center center',
          },
          // Customize the text
          text: {
            fill: '#4b4b4b',
            // Text size
            fontSize: '20px',
          },
        }}
      />
    </div>
  );
};
export default Chart;
