import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScoreCard } from '../components/fortune/ScoreCard';
import { FortuneGrid } from '../components/fortune/FortuneGrid';
import { LuckyBox } from '../components/fortune/LuckyBox';
import { AdviceCard } from '../components/fortune/AdviceCard';
import { DayPillarCard } from '../components/fortune/DayPillarCard';
import { ElementAnalysisCard } from '../components/fortune/ElementAnalysisCard';
import { NameElementCard } from '../components/fortune/NameElementCard';
import { CautionCard } from '../components/fortune/CautionCard';
import { ClosingActions } from '../components/fortune/ClosingActions';
import { PersonaIntro } from '../components/fortune/PersonaIntro';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { generateDummyFortune, type FortuneInput } from '../data/dummyFortune';
import { PERSONA } from '../data/sajuKnowledge';

const TABS: TabItem[] = [
  { id: 'today', label: '오늘의 운세' },
  { id: 'saju', label: '사주팔자' },
  { id: 'caution', label: '조심할 것' },
];

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const input = location.state as FortuneInput | null;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

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
    return <div className="loading">{PERSONA.name}이 그대의 사주를 짚어보고 있습니다...</div>;
  }

  return (
    <section>
      <PersonaIntro />
      <Tabs items={TABS} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === 'today' && (
        <>
          <ScoreCard score={fortune.overallScore} summary={fortune.summary} />
          <div className="section">오늘의 운세</div>
          <FortuneGrid categories={fortune.categories} />
          <LuckyBox color={fortune.luckyColor} number={fortune.luckyNumber} />
          <div style={{ marginTop: 20 }}>
            <AdviceCard advice={fortune.advice} />
          </div>
        </>
      )}

      {activeTab === 'saju' && fortune.dayPillar && fortune.dayYinYang && (
        <>
          <DayPillarCard dayPillar={fortune.dayPillar} dayYinYang={fortune.dayYinYang} personality={fortune.personality} />
          {fortune.todayPillar && fortune.todayRelationComment && fortune.gains && fortune.losses && fortune.nearTermTrend && (
            <ElementAnalysisCard
              todayGanji={fortune.todayPillar.ganji}
              relationComment={fortune.todayRelationComment}
              gains={fortune.gains}
              losses={fortune.losses}
              trend={fortune.nearTermTrend}
            />
          )}
          {fortune.nameAnalysis && (
            <NameElementCard nameAnalysis={fortune.nameAnalysis} relationComment={fortune.nameRelationComment} />
          )}
        </>
      )}

      {activeTab === 'caution' && <CautionCard caution={fortune.caution} />}

      <ClosingActions />
    </section>
  );
}
