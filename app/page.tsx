'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, SurveyData } from './types/index';
import SurveyForm from './components/SurveyForm';

const questions: Question[] = [
  {
    id: 1,
    type: 'rating',
    question: '당신은 새로운 환경에 적응하는 것이 얼마나 쉽나요?',
  },
  {
    id: 2,
    type: 'score',
    question: '1부터 10까지, 당신의 현재 스트레스 수준은 어느 정도인가요?',
  },
  {
    id: 3,
    type: 'multipleChoice',
    question: '다음 중 당신이 가장 즐기는 활동은 무엇인가요? (복수 선택 가능)',
    choices: ['독서', '운동', '요리', '여행', '음악 감상'],
  },
  {
    id: 4,
    type: 'rating',
    question: '당신은 팀 프로젝트에서 리더 역할을 맡는 것을 얼마나 선호하나요?',
  },
  {
    id: 5,
    type: 'score',
    question: '1부터 10까지, 당신의 현재 직무 만족도는 어느 정도인가요?',
  },
];

export default function Survey() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (surveyData: SurveyData) => {
    const existingData = JSON.parse(localStorage.getItem('surveyData') || '[]');
    existingData.push(surveyData);
    localStorage.setItem('surveyData', JSON.stringify(existingData));

    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="survey-container">
      <h1 className="survey-title">팀 분위기 및 직무 만족도 설문</h1>
      {!submitted ? (
        <SurveyForm questions={questions} onSubmit={handleSubmit} />
      ) : (
        <div className="survey-completion">
          <p>설문에 참여해 주셔서 감사합니다!</p>
          <p>곧 결과 대시보드로 이동합니다</p>
        </div>
      )}
    </div>
  );
}