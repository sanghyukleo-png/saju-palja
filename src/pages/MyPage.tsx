import { useEffect, useMemo, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { DUMMY_HISTORY } from '../data/dummyFortune';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import styles from './MyPage.module.css';

interface Profile {
  display_name: string | null;
  created_at: string;
}

export function MyPage() {
  const { user, configured } = useAuth();
  const [keyword, setKeyword] = useState('');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(configured);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!configured || !supabase || !user) {
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    supabase
      .from('profiles')
      .select('display_name, created_at')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setProfile(data);
          setDisplayName(data.display_name ?? '');
        }
        setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [configured, user]);

  async function handleSave() {
    if (!supabase || !user) return;
    setSaving(true);
    setSaveMessage('');

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: displayName });

    setSaving(false);
    setSaveMessage(error ? '저장에 실패했어요. 다시 시도해주세요.' : '저장했어요.');
  }

  const filtered = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return DUMMY_HISTORY;
    return DUMMY_HISTORY.filter(
      (entry) => entry.summary.includes(trimmed) || entry.date.includes(trimmed),
    );
  }, [keyword]);

  const joinedLabel = profile?.created_at
    ? `${new Date(profile.created_at).getFullYear()}년 ${new Date(profile.created_at).getMonth() + 1}월부터 함께하고 있어요`
    : '';

  const avatarLetter = (configured ? displayName || user?.email : '게') || '게';

  return (
    <section>
      <h1 style={{ marginBottom: 24 }}>마이페이지</h1>

      {!configured && (
        <p className={styles.demoBanner}>⚠️ 백엔드 연결 전 데모 화면이에요. 값을 바꿔도 저장되지 않아요.</p>
      )}

      <div className="card">
        <div className={styles.profileRow}>
          <div className={styles.avatar}>{avatarLetter[0]}</div>
          <div>
            <h3 style={{ margin: 0 }}>{configured ? user?.email : '게스트'}</h3>
            {joinedLabel && (
              <p className="muted" style={{ margin: 0 }}>
                {joinedLabel}
              </p>
            )}
          </div>
        </div>

        <hr />

        {profileLoading ? (
          <p className="muted">프로필을 불러오는 중...</p>
        ) : (
          <>
            <Input
              label="닉네임"
              id="display-name"
              placeholder="다른 사람에게 보여질 이름"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!configured}
              style={{ marginBottom: 16 }}
            />
            <Button onClick={handleSave} disabled={!configured || saving}>
              {saving ? '저장 중...' : '프로필 저장'}
            </Button>
            {saveMessage && (
              <p className="muted text-center" style={{ marginTop: 8 }}>
                {saveMessage}
              </p>
            )}
          </>
        )}
      </div>

      <div className="section">활동 내역</div>
      <div className="card">
        <Input
          label="검색"
          id="history-search"
          placeholder="날짜 또는 키워드로 검색 (예: 2026-07, 연애)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ marginBottom: 8 }}
        />

        {filtered.length === 0 ? (
          <p className={styles.empty}>검색 결과가 없어요.</p>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id} className={styles.historyItem}>
              <div>
                <p className={styles.historyDate}>{entry.date}</p>
                <p style={{ margin: 0 }}>{entry.summary}</p>
              </div>
              <span className={styles.historyScore}>{entry.overallScore}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
