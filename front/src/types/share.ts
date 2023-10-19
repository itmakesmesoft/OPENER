// 유저 관련 타입
export interface User {
  email?: string | null | undefined;
  user?: {
    accessToken: string;
    code: number;
    data: {
      email: string;
      nickname: string;
      profile?: string;
      interests?: string;
    };
  };
}
export interface userInterface {
  name: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  birth: string; // Use string instead of Date to avoid validation errors
}
export interface userLoginInterface {
  email: string;
  password: string;
}
export interface userRegisterInterface {
  email: string;
  password: string;
  confirmPassword?: string;
  nickname: string;
  birth: string; // YYYY-MM-DD string format
  gender: 'MALE' | 'FEMALE'; // enum
}
export interface emailAuthCheckInterface {
  email: string;
  code: string;
}
export interface interestInterface {
  interestId: number;
  interest: string;
}
export interface slideInterface {
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  arrows: boolean;
  autoplay: boolean;
  rows?: number;
}
// end of 유저 관련 타입

// response 관련 타입
export interface responseInterface {
  code: number;
  message: string;
}

// 메인페이지 관련
export interface mainRoadmapInterface {
  videoId: string;
  engSentence: string;
  korSentence: string;
  status_date: string | null;
}
export interface mainRecommendInterface {
  videoId: string;
  thumbnailUrl: string | null | undefined;
  engSentence: string;
  korSentence: string;
}

// 로드맵 관련 타입
export interface stepInterface {
  stepNo: string;
  list: themeInterface[];
  isLocked?: boolean;
}

export interface themeInterface {
  stepTheme: string;
  list: sentenceInterface[];
  isLocked?: boolean;
}

export interface sentenceInterface {
  videoId: string;
  engSentence: string;
  korSentence: string;
  stepTheme: string;
  sentenceNo: string;
  statusDate: string | undefined;
}

// end of 로드맵 관련 타입

// 쉐도잉 관련 타입
export type stateType = {
  videoUrl: string;
  videoStart: number;
  videoEnd: number;
  views: number;
  marked: boolean; // 북마크 여부
  repeat: boolean; // 영상 반복 재생 여부
};

export type infoRefType = {
  engCaption: scriptInterface[];
  korCaption: scriptInterface[];
  capLength: number;
  currentCapIdx: number;
  repeatIdx: number | null;
  repeat: boolean;
};

export interface scriptInterface {
  start: number;
  end: number;
  text: string;
}

export type videoInfoType = {
  start: number;
  end: number;
  engCaption: scriptInterface[];
  korCaption: scriptInterface[];
  videoUrl: string;
  marked: boolean | undefined;
  repeat: boolean;
};

export interface contentInterface {
  length: number;
  shadowingCategoryDtoList: listInterface[];
}

export interface listInterface {
  videoId: string;
  thumbnailUrl: string;
  engSentence: string;
  korSentence: string;
  isMarked: string;
}
export type searchWordType = {
  word: string;
  index: number;
  origin: string;
};

export type captionType = {
  eng: string;
  kor: string;
};

// end of 쉐도잉 관련 타입

// 챌린지 원본 타입
export interface originalChallenge {
  challengeId: number;
  title: string;
  challengeUrl: string;
  startTime: string;
  endTime: string;
  joinCount: number;
}

// 챌린지 인덱스 설정
export interface ChallengeIndex {
  startIndex: number;
  endIndex: number;
}

// index별로 가져오는 멤버 챌린지 리스트
export interface indexMemberChallengeList {
  original: originalChallenge;
  totalLength: number;
  memberChallengeResponseDtoList: memberChallenge[];
}

// 불러오는 멤버 챌린지
export interface memberChallenge {
  memberChallengeId: number;
  memberChallengeImg: string;
  likeCount: number;
  memberChallengeDate: string;
}

// all 페이지에서 가져오는 챌린지 리스트
export interface allMemberChallengeList {
  totalLength: number;
  memberChallengeList: memberChallenge[];
}

export interface idMemberChallengeList {
  original: originalChallenge;
  totalLength: number;
  memberChallengeList: memberChallenge[];
}

// 원본 영상
export interface originalVideo {
  challengeId: number;
  challengeUrl: string;
  endTime: string;
  joinCount: number;
  startTime: string;
  title: string;
  caption: string;
}

// 채팅
export interface Message {
  nickname: string;
  message: string;
  roomId: string;
  turn: number;
}

export interface curMemberChallenge {
  isLike: boolean;
  memberChallengeId: number;
  memberChallengeNickname: string;
  memberChallengeUrl: string;
}

export interface challengeDetail {
  curMemberChallenge: curMemberChallenge;
  watchOriginalChallengeResponseDto: originalVideo;
}

export interface challengeCategorySwrData {
  data: allMemberChallengeList;
}

export interface challengeIdSwrData {
  data: idMemberChallengeList;
}

export interface rankInterface {
  nickname: string;
  score: number;
  rank: number;
  profile: string;
}
