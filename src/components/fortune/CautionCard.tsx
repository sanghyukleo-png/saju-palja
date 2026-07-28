export function CautionCard({ caution }: { caution: string }) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>🧭 오늘 조심할 것</div>
      <p className="result">{caution}</p>
    </div>
  );
}
