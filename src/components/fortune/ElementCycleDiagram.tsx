import type { DayPillar } from '../../data/sajuKnowledge';

type Element = DayPillar['element'];

const ORDER: Element[] = ['목', '화', '토', '금', '수'];

const NODE_POS: Record<Element, { x: number; y: number }> = {
  목: { x: 110, y: 25 },
  화: { x: 190.8, y: 83.7 },
  토: { x: 160, y: 178.8 },
  금: { x: 60, y: 178.8 },
  수: { x: 29.2, y: 83.7 },
};

const ELEMENT_HANJA: Record<Element, string> = { 목: '木', 화: '火', 토: '土', 금: '金', 수: '水' };
const ELEMENT_COLOR: Record<Element, string> = {
  목: '#4ade80',
  화: '#f87171',
  토: '#d99c17',
  금: '#e5e7eb',
  수: '#38bdf8',
};

function indexOf(e: Element) {
  return ORDER.indexOf(e);
}

function edgeType(a: Element, b: Element): 'same' | 'generate' | 'overcome' {
  if (a === b) return 'same';
  const diff = Math.abs(indexOf(a) - indexOf(b));
  return diff === 1 || diff === 4 ? 'generate' : 'overcome';
}

interface ElementCycleDiagramProps {
  elementA: Element;
  elementB: Element;
  labelA: string;
  labelB: string;
}

export function ElementCycleDiagram({ elementA, elementB, labelA, labelB }: ElementCycleDiagramProps) {
  const mode = edgeType(elementA, elementB);
  const highlightColor = mode === 'overcome' ? 'var(--danger)' : 'var(--success)';

  return (
    <div>
      <svg viewBox="0 0 220 210" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }}>
        {/* 상생(相生) 순환 */}
        {ORDER.map((el, i) => {
          const next = ORDER[(i + 1) % ORDER.length];
          const p1 = NODE_POS[el];
          const p2 = NODE_POS[next];
          return (
            <line
              key={`gen-${el}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--gold)"
              strokeWidth={1.2}
              opacity={0.35}
            />
          );
        })}
        {/* 상극(相剋) 순환 */}
        {ORDER.map((el, i) => {
          const skip = ORDER[(i + 2) % ORDER.length];
          const p1 = NODE_POS[el];
          const p2 = NODE_POS[skip];
          return (
            <line
              key={`over-${el}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--danger)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.25}
            />
          );
        })}

        {/* 이번 관계 강조선 */}
        {mode !== 'same' && (
          <line
            x1={NODE_POS[elementA].x}
            y1={NODE_POS[elementA].y}
            x2={NODE_POS[elementB].x}
            y2={NODE_POS[elementB].y}
            stroke={highlightColor}
            strokeWidth={3}
          />
        )}

        {ORDER.map((el) => {
          const isHighlighted = el === elementA || el === elementB;
          const pos = NODE_POS[el];
          return (
            <g key={el}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHighlighted ? 24 : 20}
                fill="var(--bg-card)"
                stroke={isHighlighted ? highlightColor : ELEMENT_COLOR[el]}
                strokeWidth={isHighlighted ? 2.5 : 1.2}
              />
              <text x={pos.x} y={pos.y - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={ELEMENT_COLOR[el]}>
                {el}
              </text>
              <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize={9} fill="var(--text-light)">
                {ELEMENT_HANJA[el]}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
        <span>─ 상생(相生)</span>
        <span>┄ 상극(相剋)</span>
      </div>

      <p className="muted text-center" style={{ fontSize: 13, marginTop: 8 }}>
        {mode === 'same' ? `${labelA} · ${labelB} — 같은 오행(비화)` : `${labelA} → ${labelB} : ${mode === 'generate' ? '상생' : '상극'} 관계`}
      </p>
    </div>
  );
}
