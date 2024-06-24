import React from 'react';
import { Question } from '../types/index';

type Props = {
  question: Question;
  onAnswer: (answer: number | number[]) => void;
  currentAnswer?: number | number[];
};

export default function QuestionCard({ question, onAnswer, currentAnswer }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      onAnswer(value);
    }
  };

  const handleScoreInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value + event.key, 10);
    
    if (
      !(event.key >= '0' && event.key <= '9')
    ) {
      event.preventDefault();
    }
    
    if (value < 1 || value > 10) {
      event.preventDefault();
    }
  };

  const handleMultipleChoice = (value: number) => {
    let newAnswer: number[];
    if (Array.isArray(currentAnswer)) {
      newAnswer = [...currentAnswer];
      const index = newAnswer.indexOf(value);
      if (index > -1) {
        newAnswer.splice(index, 1);
      } else {
        newAnswer.push(value);
      }
    } else {
      newAnswer = [value];
    }
    onAnswer(newAnswer);
  };

  return (
    <div className="question-card">
      <h3>{question.question}</h3>
      {question.type === 'rating' && (
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="rating-label">
              <input
                type="radio"
                value={rating}
                checked={currentAnswer === rating}
                onChange={() => onAnswer(rating)}
                name={`question-${question.id}`}
                className="rating-input"
              />
              {rating}
            </label>
          ))}
        </div>
      )}
      {question.type === 'score' && (
        <input
          type="number"
          min="1"
          max="10"
          value={currentAnswer as number || ''}
          onChange={handleChange}
          onKeyDown={handleScoreInput}
          className="score-input"
        />
      )}
      {question.type === 'multipleChoice' && (
        <div className="multiple-choice-options">
          {question.choices?.map((choice, index) => (
            <label key={index} className="choice-label">
              <input
                type="checkbox"
                checked={Array.isArray(currentAnswer) && currentAnswer.includes(index + 1)}
                onChange={() => handleMultipleChoice(index + 1)}
                className="choice-input"
              />
              {choice}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}