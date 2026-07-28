interface LuckyBoxProps {
  color: string;
  number: number;
}

export function LuckyBox({ color, number }: LuckyBoxProps) {
  return (
    <div className="lucky-box">
      <div className="lucky-title">🍀 오늘의 행운</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="muted" style={{ margin: 0 }}>행운의 색</p>
          <span className="lucky-color">{color}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="muted" style={{ margin: 0 }}>행운의 숫자</p>
          <span className="lucky-number">{number}</span>
        </div>
      </div>
    </div>
  );
}
