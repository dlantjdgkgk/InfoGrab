export type Question = {
    id: number;
    type: 'rating' | 'score' | 'multipleChoice';
    question: string;
    choices?: string[];
  };
  export type SurveyData = {
    team: string;
    name: string;
    answers: (number | number[])[];
  };