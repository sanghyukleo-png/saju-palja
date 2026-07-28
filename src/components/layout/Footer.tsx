import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 사주팔자 운세보기</span>
      <nav className={styles.links}>
        <Link to="/privacy">개인정보처리방침</Link>
        <Link to="/terms">이용약관</Link>
        <a href="mailto:sajupalja3@gmail.com">문의하기</a>
      </nav>
    </footer>
  );
}
