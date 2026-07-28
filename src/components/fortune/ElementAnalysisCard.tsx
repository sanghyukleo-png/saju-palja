import type { NearTermTrendPoint } from '../../data/dummyFortune';
import styles from './ElementAnalysisCard.module.css';

interface ElementAnalysisCardProps {
  todayGanji: string;
  relationComment: string;
  gains: string;
  losses: string;
  trend: NearTermTrendPoint[];
}

const TREND_STYLE: Record<NearTermTrendPoint['trend'], string> = {
  상승: styles.trendUp,
  보합: styles.trendFlat,
  주의: styles.trendDown,
};

export function ElementAnalysisCard({ todayGanji, relationComment, gains, losses, trend }: ElementAnalysisCardProps) {
  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>🔯 음양오행 기초 분석</div>
      <p className="muted" style={{ margin: '0 0 8px' }}>오늘의 일진: {todayGanji}</p>
      <p className="result">{relationComment}</p>

      <div className={styles.gainLossRow}>
        <div className={styles.gainLossBox}>
          <p className={styles.gainLossLabel}>🔵 들어오는 것</p>
          <p style={{ margin: 0 }}>{gains}</p>
        </div>
        <div className={styles.gainLossBox}>
          <p className={styles.gainLossLabel}>🔴 나가는 것</p>
          <p style={{ margin: 0 }}>{losses}</p>
        </div>
      </div>

      <hr />
      <p style={{ fontWeight: 700, marginBottom: 12 }}>📈 앞으로의 흐름</p>
      <div className={styles.trendList}>
        {trend.map((point) => (
          <div key={point.label} className={styles.trendItem}>
            <div className={`${styles.trendBadge} ${TREND_STYLE[point.trend]}`}>
              <span>{point.trend}</span>
            </div>
            <div>
              <p className={styles.trendMeta}>{point.label} · {point.dateLabel} ({point.ganji})</p>
              <p style={{ margin: 0 }}>{point.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
