![logo (2)](exec/images/%EB%A1%9C%EA%B3%A0.png)

# Opener - 영어 회화 연습을 위한 웹 사이트


## 👉프로젝트 소개

### 서비스 개요

- 스피킹을 통한 영어 학습 웹 사이트

### 주요 기능

- 내 학습 로드맵을 따라 영어 영상 학습
- 쉐도잉을 통한 반복 연습 및 발음 평가를 통한 영어 학습
- 사용자 정보 기반 추천 쉐도잉 영상 제공
- 선택한 주제 기반 AI와의 음성 채팅
- 유저와의 음성 채팅으로 문법, 문맥 점수 기반 게임
- 다양한 상황별 챌린지를 통한 자연스러운 영어 구사 연습
- ELO 점수 시스템을 이용한 랭킹 시스템

</br>

## 🏞️개발 환경

### Frontend

| React | 18.2.0 |
| --- | --- |
| Node.js | 18.16.0 |
| VSCode | 1.77.0 |
| tailwind | 3.3.1 |
| npm | 8.19.2 |
| eslint | 8.36.0 |
| recoil | 0.7.7 |

### Backend

| Spring Boot | 2.7.11 |
| --- | --- |
| Java | 11 |
| IntelliJ | 2022.3.1 |
| FastAPI | 0.95.0 |
| Python | latest |
| MySQL | 8.0.32 |
| Redis | latest |

</br>

## 📐아키텍처 설계

![image](exec/images/%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png)

</br>

## 💻피그마 설계

![image](exec/images/%ED%94%BC%EA%B7%B8%EB%A7%88.png)

</br>

## 💽ERD 설계

### Member Service / Shaodowing Service
<p align="center">
<img src=exec/images/%EB%A9%A4%EB%B2%84erd.png width="350" height="200">
<img src=exec/images/%EC%89%90%EB%8F%84%EC%9E%89erd.png width="350" height="200">
</p>

### Challenge Service / Chatting Service
<p align="center">
<img src=exec/images/%EC%B1%8C%EB%A6%B0%EC%A7%80erd.png width="350" height="200">
<img src=exec/images/%EC%B1%84%ED%8C%85erd.png width="350" height="200">
</p>

</br>

# 📺주요 화면

## 메인 페이지

### 학습 로드맵 / 인기 챌린지

</br>

- 자신이 현재 학습 중인 쉐도잉 영상 진도가 나타납니다.
- 좋아요 순 인기 챌린지 목록이 나타납니다.

<p align="center">
<img src=exec/images/%EB%82%B4%EB%A1%9C%EB%93%9C%EB%A7%B5.png width="550" height="200">
<img src=exec/images/%EC%9D%B8%EA%B8%B0%EC%B1%8C%EB%A6%B0%EC%A7%80.png width="350" height="200">
</p>


</br>

### 추천 문장 / TREB 랭킹

</br>

<p align="center">
<img src=exec/images/%EC%B6%94%EC%B2%9C%EB%AC%B8%EC%9E%A5.png width="450" height="200">
<img src=exec/images/%EB%9E%AD%ED%82%B9.png width="450" height="200">
</p>


</br>

- 사용자 정보를 기반으로 영어 문장을 추천해줍니다.
- 유저 게임 상위 10위권 사용자들이 나타납니다.

</br>

## 쉐도잉 학습 페이지

### 카테고리 별 쉐도잉 영상 목록

</br>

![쉐도잉목록](exec/images/%EC%89%90%EB%8F%84%EC%9E%89%EB%AA%A9%EB%A1%9D.gif)

</br>

- 카테고리 별로 쉐도잉 영상 목록을 볼 수 있습니다.

</br>

### 쉐도잉 영상 학습 페이지

</br>

![발음평가](exec/images/%EB%B0%9C%EC%9D%8C%ED%8F%89%EA%B0%80.gif)

</br>

- 마이크 버튼을 누르고 문장을 따라 말해 발음 평가를 받을 수 있습니다.
- 정확도, 완성도, 발음, 유창성에 대한 점수를 얻을 수 있습니다.

</br>

![쉐도잉학습상세](exec/images/%EC%89%90%EB%8F%84%EC%9E%89%ED%95%99%EC%8A%B5%EC%83%81%EC%84%B8.png)

</br>

- 쉐도잉 영상의 문장을 반복하면서 학습할 수 있습니다.
- 문장의 단어를 누르면 단어장을 볼 수 있습니다.

</br>

![다음자막](exec/images/%EC%89%90%EB%8F%84%EC%9E%89%ED%95%99%EC%8A%B5%EC%83%81%EC%84%B8.gif)

- 화살표 버튼으로 다음 자막으로 이동해 학습할 수 있습니다.
- 구간 영상을 20번 반복 학습하게 되면 학습이 완료됩니다.

</br>

## 챌린지 페이지

### 원본 챌린지 목록 페이지

</br>

![챌린지목록](exec/images/%EC%B1%8C%EB%A6%B0%EC%A7%80%EB%AA%A9%EB%A1%9D.gif)

</br>

- 참여할 수 있는 챌린지 목록을 볼 수 있습니다.

</br>

### 챌린지를 참여한 사람들의 챌린지 목록 페이지

</br>

![챌린지참여하기](exec/images/%EC%B1%8C%EB%A6%B0%EC%A7%80%EC%83%81%EC%84%B8.png)

</br>

- 해당 챌린지에 참여한 사용자들의 챌린지 목록을 볼 수 있습니다.
- 미리보기를 누르면 원본 챌린지 영상을 볼 수 있습니다.
- 참여하기를 누르면 해당 챌린지에 참여할 수 있습니다.

</br>

### 사용자 챌린지 페이지

</br>

![챌린지재생](exec/images/%EC%B1%8C%EB%A6%B0%EC%A7%80%EC%9E%AC%EC%83%9D.gif)

</br>

- 사용자 챌린지를 볼 수 있습니다.
- 좋아요를 누를 수 있습니다.
- 자신의 챌린지면 삭제할 수 있습니다.
- 공유 버튼을 눌러 링크를 복사할 수 있습니다.

</br>

## 채팅 페이지

</br>

![채팅페이지](exec/images/%EC%B1%84%ED%8C%85%EC%84%A0%ED%83%9D.png)

</br>

- AI와 채팅, 사용자와의 채팅 중 선택할 수 있습니다.

</br>

### AI 채팅

</br>

![AI채팅주제선택](exec/images/%EC%B1%84%ED%8C%85%EA%B4%80%EC%8B%AC%EC%82%AC%EC%84%A0%ED%83%9D.png)

</br>

- 대화하고 싶은 주제를 선택할 수 있습니다.

</br>

![ai채팅시작](exec/images/ai%EC%B1%84%ED%8C%85%EC%8B%9C%EC%9E%91.gif)

</br>

- 선택한 주제를 바탕으로 AI의 첫 채팅이 나옵니다. AI와 자유롭게 대화할 수 있습니다.

</br>

![ai채팅](exec/images/ai%EC%B1%84%ED%8C%85%EB%B3%B4%EB%83%84.gif)

-  마이크 버튼을 눌러 말한 내용이 대화창에 표시됩니다.
-  인식을 잘못한 부분이 있다면 키보드 버튼을 눌러 수정할 수 있습니다.
-  채팅을 보내면 AI의 답장을 받으며 계속 채팅을 이어갈 수 있습니다.
-  말을 잘못 인식했다면 내용을 초기화할 수 있습니다.

</br>

### 유저와 채팅 게임

![유저게임매칭](exec/images/%EB%A7%A4%EC%B9%AD%EA%B8%B0%EB%8B%A4%EB%A6%BC.gif)

</br>

- 대화 게임하기 버튼을 눌러 매칭을 기다릴 수 있습니다.
- ELO 시스템을 통해 자신의 점수 구간에 맞는 사람들이 매칭됩니다.

</br>

![매칭성공](exec/images/%EB%A7%A4%EC%B9%AD%EB%90%A8.gif)

</br>

- 게임할 수 있는 상대가 대기열에 들어오면 매칭되고, 채팅방으로 이동합니다.

</br>

![내가보냄](exec/images/%EC%9C%A0%EC%A0%80%EC%B1%84%ED%8C%85%EB%A7%90%ED%95%A8.gif)
![상대방이보냄](exec/images/%EB%8B%B5%EC%9E%A5%EC%98%B4.gif)

</br>

- 자기 턴에만 음성 채팅을 보낼 수 있습니다.
- 제시어를 포함해 말하면 보너스 점수가 부여됩니다.

</br>

![패스](exec/images/pass.gif)

</br>

- 제한시간 안에 말하지 못하면 pass가 됩니다.

</br>

### 채팅 결과 페이지

</br>

![결과창이동](exec/images/%EA%B2%B0%EA%B3%BC%EB%A1%9C%EC%9D%B4%EB%8F%99.gif)

</br>

- 10번의 턴이 끝나면 결과 페이지로 이동합니다.
- ELO 기반 점수 시스템으로 점수가 부여됩니다.
- 상대와 나의 문법 점수, 문맥 점수를 볼 수 있습니다.
- 
</br>

![문법피드백](exec/images/%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80.gif)

</br>

- 오른쪽에서 내 문장의 각각 문법 피드백을 볼 수 있습니다.

</br>

## 로드맵 페이지

</br>

![로드맵](exec/images/%EB%A1%9C%EB%93%9C%EB%A7%B5.gif)

</br>

- 현재 내 학습 로드맵을 볼 수 있습니다.
- 순서대로 학습할 시 다음 단계를 볼 수 있습니다.
