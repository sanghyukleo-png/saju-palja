import type { NameAnalysis } from '../../lib/hanjaAnalysis';

const ELEMENT_COLOR: Record<NameAnalysis['element'], string> = {
  목: '#4ade80',
  화: '#f87171',
  토: '#d99c17',
  금: '#e5e7eb',
  수: '#38bdf8',
};

export function NameElementCard({ nameAnalysis, relationComment }: { nameAnalysis: NameAnalysis; relationComment: string | null }) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>📜 이름의 오행</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {nameAnalysis.characters.map((c, i) => (
          <div
            key={i}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              minWidth: 56,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: ELEMENT_COLOR[c.element] }}>{c.char}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{c.strokes}획 · {c.element}</div>
          </div>
        ))}
      </div>
      <p style={{ margin: 0 }}>
        총 획수는 <strong style={{ color: ELEMENT_COLOR[nameAnalysis.element] }}>{nameAnalysis.totalStrokes}획</strong>으로,
        이름의 오행은 <strong style={{ color: ELEMENT_COLOR[nameAnalysis.element] }}>{nameAnalysis.element}</strong>의 기운이에요.
      </p>
      {relationComment && (
        <>
          <hr />
          <p className="result">{relationComment}</p>
        </>
      )}
    </div>
  );
}
