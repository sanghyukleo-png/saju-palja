import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.tab} ${item.id === activeId ? styles.tabActive : ''}`}
          onClick={() => onChange(item.id)}
          aria-current={item.id === activeId}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
