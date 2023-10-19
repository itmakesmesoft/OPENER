import { scriptInterface } from '@/types/share';

export const vttToCaption = (caption: string) => {
  const resArray: scriptInterface[] = [];
  if (caption) {
    const subtitles = caption.replace('WEBVTT\n\n', '');
    const subtitle = subtitles.split('\n\n');
    for (let i = 0; i < subtitle.length; i++) {
      const sub = subtitle[i].split('\n');
      const subtitleTime = sub[0].split(' --> ');
      const subtitleText = sub.slice(1).join('\n');
      if (subtitleTime) {
        resArray.push({
          start: convertTime(subtitleTime[0]),
          end: convertTime(subtitleTime[1]),
          text: subtitleText,
        });
      }
    }
  }
  return [...resArray];
};

export const convertTime = (timeString: string): number => {
  if (!timeString) return 0;
  const wholetime = timeString.split('.');
  const time: number[] = wholetime[0].split(/[:,]/).map(parseFloat);
  const millisecond: number = parseInt(wholetime[1]) / 1000;
  if (time.length > 2) {
    const [hours, minutes, seconds] = time;
    return hours * 3600 + minutes * 60 + seconds + millisecond;
  } else {
    const [minutes, seconds] = time;
    return minutes * 60 + seconds + millisecond;
  }
};
