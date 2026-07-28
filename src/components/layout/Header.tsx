import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark}>사주팔자</span>
        <span className={styles.tagline}>운세보기</span>
      </Link>
      {user ? (
        <button type="button" className={styles.loginLink} onClick={handleSignOut}>
          로그아웃
        </button>
      ) : (
        <Link to="/login" className={styles.loginLink}>
          로그인
        </Link>
      )}
    </header>
  );
}
