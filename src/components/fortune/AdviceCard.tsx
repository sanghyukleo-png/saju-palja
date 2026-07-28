export function AdviceCard({ advice }: { advice: string }) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>✨ 오늘의 조언</div>
      <p className="result">{advice}</p>
    </div>
  );
}
