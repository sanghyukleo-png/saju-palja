import type { DayPillar } from '../../data/sajuKnowledge';

const ELEMENT_COLOR: Record<DayPillar['element'], string> = {
  목: '#4ade80',
  화: '#f87171',
  토: '#d99c17',
  금: '#e5e7eb',
  수: '#38bdf8',
};

export function DayPillarCard({
  dayPillar,
  dayYinYang,
  personality,
}: {
  dayPillar: DayPillar;
  dayYinYang: '양' | '음';
  personality: string;
}) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>🌙 나의 일주(日柱)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.05)',
            color: ELEMENT_COLOR[dayPillar.element],
            border: '1px solid var(--border)',
          }}
        >
          {dayPillar.ganji}
        </div>
        <p style={{ margin: 0 }}>
          일간(日干)은 <strong style={{ color: ELEMENT_COLOR[dayPillar.element] }}>{dayPillar.stem}({dayPillar.stemHanja})</strong>,
          음양오행으로는{' '}
          <strong style={{ color: ELEMENT_COLOR[dayPillar.element] }}>
            {dayYinYang}{dayPillar.element}({dayPillar.elementHanja})
          </strong>{' '}
          기운이에요.
        </p>
      </div>
      <p className="muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
        {dayPillar.stem}({dayPillar.stemHanja}) — {dayPillar.stemMeaning}
      </p>
      <hr />
      <p className="result">{personality}</p>
    </div>
  );
}
