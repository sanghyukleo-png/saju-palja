import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export function Login() {
  const { signIn, signUp, signInWithOAuth, configured } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeTone, setNoticeTone] = useState<'error' | 'info'>('info');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setNotice('');

    const { error } = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);

    setSubmitting(false);

    if (error) {
      setNoticeTone('error');
      setNotice(error);
      return;
    }

    if (mode === 'signup') {
      setNoticeTone('info');
      setNotice('가입 요청을 보냈어요. 이메일 인증이 필요하면 메일함을 확인해주세요.');
      return;
    }

    navigate('/mypage');
  }

  async function handleOAuth(provider: 'google' | 'kakao') {
    setNotice('');
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setNoticeTone('error');
      setNotice(error);
    }
  }

  return (
    <section>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <h1>{mode === 'signin' ? '로그인' : '회원가입'}</h1>
        <p>로그인하고 나만의 운세 기록을 저장해보세요</p>
      </div>

      {!configured && (
        <p className={styles.demoBanner}>
          ⚠️ 아직 백엔드가 연결되지 않았어요. Supabase 설정 후 정상 동작해요.
        </p>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <Input
          label="이메일"
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          label="비밀번호"
          id="password"
          type="password"
          placeholder="********"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 24 }}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? '처리 중...' : mode === 'signin' ? '이메일로 로그인' : '이메일로 회원가입'}
        </Button>

        <button
          type="button"
          className={styles.toggleMode}
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setNotice('');
          }}
        >
          {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>

        <div className={styles.dividerRow}>또는</div>

        <button type="button" className={`secondary ${styles.socialButton}`} onClick={() => handleOAuth('google')}>
          Google로 계속하기
        </button>
        <button type="button" className={`secondary ${styles.socialButton}`} onClick={() => handleOAuth('kakao')}>
          카카오로 계속하기
        </button>

        {notice && <p className={noticeTone === 'error' ? styles.noticeError : styles.notice}>{notice}</p>}
      </form>
    </section>
  );
}
