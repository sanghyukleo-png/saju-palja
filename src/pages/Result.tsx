import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScoreCard } from '../components/fortune/ScoreCard';
import { FortuneGrid } from '../components/fortune/FortuneGrid';
import { LuckyBox } from '../components/fortune/LuckyBox';
import { AdviceCard } from '../components/fortune/AdviceCard';
import { DayPillarCard } from '../components/fortune/DayPillarCard';
import { generateDummyFortune, type FortuneInput } from '../data/dummyFortune';

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const input = location.state as FortuneInput | null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!input) {
      navigate('/', { replace: true });
      return;
    }
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [input, navigate]);

  const fortune = useMemo(() => (input ? generateDummyFortune(input) : null), [input]);

  if (!input || !fortune) {
    return null;
  }

  if (loading) {
    return <div className="loading">AI가 사주를 분석하고 있습니다...</div>;
  }

  return (
    <section>
      <ScoreCard score={fortune.overallScore} summary={fortune.summary} />
      {fortune.dayPillar && <DayPillarCard dayPillar={fortune.dayPillar} />}
      <div className="section">오늘의 운세</div>
      <FortuneGrid categories={fortune.categories} />
      <LuckyBox color={fortune.luckyColor} number={fortune.luckyNumber} />
      <div style={{ marginTop: 20 }}>
        <AdviceCard advice={fortune.advice} />
      </div>
    </section>
  );
}
