import axios from 'axios';
import { shadowingApi } from './axiosConfig';
import { getSession } from 'next-auth/react';

const FAST_API_URL = process.env.NEXT_PUBLIC_FAST_API;

// export const getShadowingList = async (url: string) => {
//   try {
//     const session = await getSession();
//     const accessToken = session?.user?.user?.accessToken;
//     const URL = accessToken ? '/auth/' + url : url;
//     const res = await shadowingApi.get(URL);
//     return accessToken
//       ? res.data.data.authShadowingCategoryDtoList
//       : res.data.data.shadowingCategoryDtoList;
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getShadowingList = async (url: string) => {
  try {
    console.log(url);
    return await shadowingApi.get(url).then((res) => res.data);
  } catch (err) {
    console.log(err);
  }
};

export const getRoadMapApi = async () => {
  console.log('getroadmap');
  const session = await getSession();
  const accessToken = session?.user?.user?.accessToken;
  const url = accessToken ? '/auth/roadmap' : '/roadmap';
  try {
    const res = await shadowingApi.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMainRoadMapApi = async () => {
  console.log('getMainRoadMapApi');
  const session = await getSession();
  const accessToken = session?.user?.user?.accessToken;
  const url = accessToken ? '/auth/main-roadmap' : '/main-roadmap';
  try {
    const res = await shadowingApi.get(url);
    return (
      res.data.themeRoadMapResponseDto.roadMapResponseDtoList ||
      res.data.authRoadMapResponseDtoList
    );
  } catch (err) {
    console.log(err);
  }
};

export const getVideoInfoApi = async (videoId: string) => {
  console.log('Video 조회 api 요청 완료');
  const session = await getSession();
  const accessToken = session?.user?.user?.accessToken;
  const url = accessToken ? '/auth/videos/' + videoId : '/videos/' + videoId;
  try {
    const res = await shadowingApi.get(url);
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getRecommendListApi = async () => {
  return await shadowingApi
    .get('/main-recommendation')
    .then((res) => res.data)
    .catch((err) => err);
};

export const setCountVideoApi = async (videoId: string) => {
  const session = await getSession();
  console.log('조회수 증가 api 요청 완료');
  const accessToken = session?.user?.user?.accessToken;
  if (accessToken) {
    return await shadowingApi
      .patch(`/auth/videos/${videoId}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
};

export const setBookmarkApi = async (videoId: string) => {
  const session = await getSession();
  const accessToken = session?.user?.user?.accessToken;
  if (accessToken) {
    shadowingApi({
      method: 'POST',
      url: `/auth/videos/${videoId}/bookmark`,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
};

// 단어사전 API
export const dictionaryApi = (word: string) => {
  console.log('요청');
  return shadowingApi.get(`/dictionary/${word}`);
};

export const getCaptionApi = async (videoUrl: string) => {
  console.log('get caption');
  return await axios({
    method: 'GET',
    url: FAST_API_URL + '/fast/caption/' + videoUrl,
  }).then((res) => res.data);
};

export const translate = async (data: string) => {
  console.log(data);
  if (data.length > 500) {
    const len = Math.ceil(data.split('\n\n').length / 2);
    console.log(len);
    const left = data.split('\n\n').splice(0, len).join('\n\n');
    const right = data.split('\n\n').splice(len).join('\n\n');
    console.log('left:', left, 'right:', right);
    const l: string[] = await translate(left);
    const r: string[] = await translate(right);
    // translate();
    return l.concat(r);
  }
  return await translateCaptionApi(data);
  // const tmp = data.split('\n\n');
  // if ()
  // const res: any = [];
  // const promise = data.split('\n\n').map(async (subtitle: string) => {
  //   const response = await translateCaptionApi(subtitle);
  //   res.push(response);
  // });
  // const result = await Promise.all(promise);

  // return result;
};

export const translateCaptionApi = async (data: string) => {
  console.log('translate 요청', data);
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'text-davinci-003',
      prompt: 'Translate these captions into korean:\n' + data,
      temperature: 0.3,
      max_tokens: 3654,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(process.env.NEXT_PUBLIC_OPEN_API),
      },
    },
  );
  console.log(response);
  return response.data.choices[0].text;
};

export const patchCaptionApi = async (payload: any, videoId: string) => {
  const res = await shadowingApi.patch(`/videos/${videoId}`, payload);
  console.log(res, 'payload :', payload);
  return res;
};
