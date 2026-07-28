import type { NameAnalysis } from '../../lib/hanjaAnalysis';
import type { DayPillar } from '../../data/sajuKnowledge';
import { ElementCycleDiagram } from './ElementCycleDiagram';

const ELEMENT_COLOR: Record<NameAnalysis['element'], string> = {
  목: '#4ade80',
  화: '#f87171',
  토: '#d99c17',
  금: '#e5e7eb',
  수: '#38bdf8',
};

export function NameElementCard({
  nameAnalysis,
  dayElement,
  relationComment,
}: {
  nameAnalysis: NameAnalysis;
  dayElement: DayPillar['element'];
  relationComment: string | null;
}) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>📜 이름의 오행</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {nameAnalysis.characters.map((c, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: ELEMENT_COLOR[c.element], flexShrink: 0, width: 36, textAlign: 'center' }}>
              {c.char}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0 }}>{c.gloss}</p>
              <p className="muted" style={{ fontSize: 12, margin: '2px 0 0' }}>{c.strokes}획 · {c.element}</p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, marginBottom: 16 }}>
        총 획수는 <strong style={{ color: ELEMENT_COLOR[nameAnalysis.element] }}>{nameAnalysis.totalStrokes}획</strong>으로,
        이름의 오행은 <strong style={{ color: ELEMENT_COLOR[nameAnalysis.element] }}>{nameAnalysis.element}</strong>의 기운이에요.
      </p>

      <ElementCycleDiagram elementA={dayElement} elementB={nameAnalysis.element} labelA="일간" labelB="이름" />

      {relationComment && (
        <>
          <hr />
          <p className="result">{relationComment}</p>
        </>
      )}
    </div>
  );
}
