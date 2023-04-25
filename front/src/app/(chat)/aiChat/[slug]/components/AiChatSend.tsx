'use client';
import React, { useState } from 'react';
import { BsArrowUp, BsKeyboard, BsMic } from 'react-icons/bs';
import 'regenerator-runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

type SendMessageFunction = (message: string) => void;
type onReceiveMessage = (message: string) => void;

interface AiChatSendProps {
  onSendMessage: SendMessageFunction;
  onReceiveMessage: onReceiveMessage;
}

class ChatGPT {
  getRandomAnswer() {
    const answers = [
      "I'm sorry, but I don't think I can make it to the meeting tomorrow.",
      "Could you please repeat that? I didn't quite catch what you said.",
      "That's a great idea! Let's definitely look into it further.",
      "I'm really looking forward to the concert this weekend.",
      "I'm afraid I won't be able to make it to your party next week.",
      "It's been a pleasure working with you on this project.",
      'Do you mind if we reschedule our call for later this week?',
      "I completely understand where you're coming from on this issue.",
      "I'm excited to see what new opportunities this job will bring.",
      'Can you give me a few more details about the proposal before I make a decision?',
    ];
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  }
}

const AiChatSend = ({ onSendMessage, onReceiveMessage }: AiChatSendProps) => {
  const chatGPT = new ChatGPT();
  const [message, setMessage] = useState('');
  const [isChat, setisChat] = useState(true);
  const [isMic, setisMic] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleMic = async () => {
    setisMic(!isMic);
    if (!listening) {
      SpeechRecognition.startListening({ language: 'en-US' });
    } else {
      await setMessage(transcript);
      await sendMessage();
      await resetTranscript();
      SpeechRecognition.stopListening();
    }
  };

  const handleKeyboard = () => {
    console.log('qwdqw');
    setisChat(!isChat);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    console.log(message);
    if (message.trim()) {
      await onSendMessage(message);
      await setMessage('');
      // ChatGPT API를 호출하여 답변을 받아오는 로직 추가
      // 우선 더미 데이터로 대체
      const answer = await chatGPT.getRandomAnswer();
      setTimeout(() => {
        onReceiveMessage(answer);
      }, 1000);
    }
  };
  return (
    <>
      {!isChat && (
        <div className="flex flex-row items-center p-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요."
            className="flex-1 mr-2 px-4 py-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:border-brandY"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={` bg-brandY hover:bg-brandG text-white font-bold py-2 px-4 rounded`}
            onClick={sendMessage}
          >
            전송
          </button>
        </div>
      )}
      <div className="bg-brandP rounded-2xl m-5 p-5 text-white grid grid-cols-3">
        <button
          type="button"
          className="flex flex-col justify-end text-3xl"
          onClick={handleKeyboard}
        >
          <BsKeyboard />
        </button>
        <div className="flex flex-col justify-center items-center">
          <div>{isMic ? '듣고있어요' : '말씀해주세요.'}</div>
          <button
            className="rounded-full bg-white p-1 text-3xl text-black w-20 h-20 flex justify-center items-center"
            onClick={handleMic}
          >
            {isMic ? <BsArrowUp /> : <BsMic />}
            {/* <BsMic />
            <BsArrowUp /> */}
          </button>
          <p>{transcript}</p>
        </div>
        <div>
          <p>message : {message}</p>
          <p>transc: {transcript}</p>
        </div>
      </div>
    </>
  );
};

export default AiChatSend;
