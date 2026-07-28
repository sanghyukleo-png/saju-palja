interface ScoreCardProps {
  score: number;
  summary: string;
}

export function ScoreCard({ score, summary }: ScoreCardProps) {
  const filledStars = Math.round(score / 20);

  return (
    <div className="card text-center">
      <div className="section" style={{ marginTop: 0 }}>
        ⭐ 종합운
      </div>
      <div className="score">{score}점</div>
      <div className="stars">{'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}</div>
      <p className="result" style={{ marginTop: 16 }}>{summary}</p>
    </div>
  );
}
