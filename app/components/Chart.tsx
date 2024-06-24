'use client';

import { useEffect, useState } from 'react';
import { SurveyData } from '../types/index';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Props = {
  surveyData: SurveyData[];
};

type TeamStats = {
  total: number;
  average: number;
  stdDev: number;
  count: number;
};

const sumAnswers = (answers: any[]): number => {
  return answers.reduce((sum: number, answer: any) => {
    if (Array.isArray(answer)) {
      return sum + answer.reduce((a, b) => a + b, 0);
    }
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
};

export default function Chart({ surveyData }: Props) {
  const [teamStats, setTeamStats] = useState<Record<string, TeamStats>>({});

  useEffect(() => {
    const stats: Record<string, TeamStats> = {};
    
    surveyData.forEach((data) => {
      if (!stats[data.team]) {
        stats[data.team] = { total: 0, average: 0, stdDev: 0, count: 0 };
      }
      const total = sumAnswers(data.answers);
      stats[data.team].total += total;
      stats[data.team].count += 1;
    });

    Object.keys(stats).forEach((team) => {
      const teamData = surveyData.filter((data) => data.team === team);
      stats[team].average = stats[team].total / stats[team].count;
      
      const squaredDiffs = teamData.map((data) => {
        const total = sumAnswers(data.answers);
        return Math.pow(total - stats[team].average, 2);
      });
      
      const variance = squaredDiffs.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / stats[team].count;
      stats[team].stdDev = Math.sqrt(variance);
    });

    setTeamStats(stats);
  }, [surveyData]);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '팀별 통계',
      },
    },
  };

  const barChartData = {
    labels: Object.keys(teamStats),
    datasets: [
      {
        label: '팀별 총점',
        data: Object.values(teamStats).map((stat) => stat.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: '팀별 평균',
        data: Object.values(teamStats).map((stat) => stat.average),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(teamStats),
    datasets: [
      {
        data: Object.values(teamStats).map((stat) => stat.stdDev),
        backgroundColor: [
          'rgba(80, 20, 33, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '팀별 표준편차',
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart">
        <h2>팀별 총점 및 평균</h2>
        <Bar options={barChartOptions} data={barChartData} />
      </div>
      <div className="chart">
        <h2>팀별 표준편차</h2>
        <Doughnut data={doughnutChartData} options={doughnutOptions} />
      </div>
    </div>
  );
}