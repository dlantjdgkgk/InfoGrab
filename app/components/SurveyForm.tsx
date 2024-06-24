import { useState } from 'react';
import { Question, SurveyData } from '../types/index';
import QuestionCard from './QuestionCard';

type Props = {
  questions: Question[];
  onSubmit: (surveyData: SurveyData) => void;
};

export default function SurveyForm({ questions, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    team: '',
    name: '',
    answers: [],
  });

  const handleAnswer = (answer: number | number[]) => {
    setSurveyData((prevData) => ({
      ...prevData,
      answers: [...prevData.answers.slice(0, step - 1), answer],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(surveyData);
  };

  const handleStartSurvey = () => {
    if (!surveyData.team || !surveyData.name) {
      alert('팀명과 이름을 모두 입력해주세요.');
    } else {
      setStep(1);
    }
  };

  const handleNextQuestion = () => {
    if (surveyData.answers[step - 1] === undefined) {
      alert('이 질문에 답변해주세요.');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      {step === 0 && (
        <div className="form-group">
          <input
            type="text"
            placeholder="팀명 입력"
            value={surveyData.team}
            onChange={(e) =>
              setSurveyData({ ...surveyData, team: e.target.value })
            }
            required
            className="form-input"
          />
          <input
            type="text"
            placeholder="이름 입력"
            value={surveyData.name}
            onChange={(e) =>
              setSurveyData({ ...surveyData, name: e.target.value })
            }
            required
            className="form-input"
          />
          <button type="button" onClick={handleStartSurvey} className="btn-start">
            설문 시작
          </button>
        </div>
      )}
      {step > 0 && step <= questions.length && (
        <div className="question-container">
          <QuestionCard
            question={questions[step - 1]}
            onAnswer={handleAnswer}
            currentAnswer={surveyData.answers[step - 1]}
          />
          <div className="btn-group">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-prev">
                이전
              </button>
            )}
            {step < questions.length ? (
              <button type="button" onClick={handleNextQuestion} className="btn-next">
                다음
              </button>
            ) : (
              <button type="submit" className="btn-submit">제출</button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}