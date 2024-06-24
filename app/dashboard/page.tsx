'use client';

import { useEffect, useState } from 'react';
import { SurveyData } from '../types/index';
import Chart from '../components/Chart';

function getSurveyData(): SurveyData[] {
  const storedData = localStorage.getItem('surveyData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
}

export default function Dashboard() {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);

  useEffect(() => {
    const data = getSurveyData();
    setSurveyData(data);
  }, []);

  return (
    <div className="dashboard">
      <h1>설문 결과 대시보드</h1>
      {surveyData.length > 0 ? (
        <Chart surveyData={surveyData} />
      ) : (
        <p>저장된 설문 데이터가 없습니다.</p>
      )}
    </div>
  );
}