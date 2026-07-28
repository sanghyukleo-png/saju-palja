import { useState } from 'react';
import { FAQ_ITEMS } from '../data/sajuKnowledge';
import styles from './Faq.module.css';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <h1>사주가 궁금해요</h1>
        <p>운세를 더 재미있게 볼 수 있는 기초 개념을 모아봤어요</p>
      </div>

      <div className="card">
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index;
          return (
            <div key={item.question} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
              >
                <span>Q. {item.question}</span>
                <svg
                  className={`${styles.chevron} ${open ? styles.open : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open && <p className={styles.answer}>{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <p className={styles.disclaimer}>사주팔자 운세보기의 콘텐츠는 재미를 위한 데모이며, 전문적인 사주 상담을 대신하지 않아요.</p>
    </section>
  );
}
