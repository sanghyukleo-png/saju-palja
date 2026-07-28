import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function ClosingActions() {
  const navigate = useNavigate();
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="card">
      <Button onClick={() => setDownloaded(true)} style={{ marginBottom: 12 }}>
        {downloaded ? '부적이 저장되었어요 ✓' : '부적 다운로드'}
      </Button>
      <Button variant="secondary" onClick={() => navigate('/')}>
        다시 보기
      </Button>
    </div>
  );
}
