import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const items = [
  {
    to: '/',
    label: '홈',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/faq',
    label: '가이드',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.8 9.5a2.2 2.2 0 1 1 3.3 1.9c-.8.5-1.1 1-1.1 1.9v.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16.7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: '/mypage',
    label: '마이페이지',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
