import { useState } from 'react';
import styles from './ShareBar.module.css';

interface ShareBarProps {
  name: string;
  score: number;
}

const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

export function ShareBar({ name, score }: ShareBarProps) {
  const [copyFeedback, setCopyFeedback] = useState('');

  const shareUrl = window.location.href;
  const shareText = `${name}님의 오늘 종합운은 ${score}점! 청운 도사가 봐준 사주팔자, 나도 확인해볼까?`;

  async function handleNativeShare() {
    try {
      await navigator.share({ title: '사주팔자 운세보기', text: shareText, url: shareUrl });
    } catch {
      // 사용자가 공유를 취소한 경우 등은 조용히 무시해요.
    }
  }

  function handleFacebookShare() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback('링크를 복사했어요!');
    } catch {
      setCopyFeedback('복사에 실패했어요. 주소창의 링크를 직접 복사해주세요.');
    }
    setTimeout(() => setCopyFeedback(''), 2500);
  }

  return (
    <div className="card">
      <div className="section" style={{ marginTop: 0 }}>🔗 결과 공유하기</div>
      <div className={styles.row}>
        {canNativeShare && (
          <button type="button" className={styles.shareButton} onClick={handleNativeShare}>
            공유하기
          </button>
        )}
        <button type="button" className={styles.shareButton} onClick={handleFacebookShare}>
          페이스북
        </button>
        <button type="button" className={styles.shareButton} onClick={handleCopyLink}>
          링크 복사
        </button>
      </div>
      {copyFeedback && <p className={styles.feedback}>{copyFeedback}</p>}
    </div>
  );
}
