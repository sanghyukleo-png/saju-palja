import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { FortuneInput } from '../../data/dummyFortune';
import { sanitizeHanjaInput } from '../../lib/hanjaAnalysis';
import styles from './FortuneForm.module.css';

function sanitizeHangulInput(value: string): string {
  return Array.from(value)
    .filter((c) => /[가-힣]/.test(c))
    .join('');
}

export function FortuneForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FortuneInput>({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    isLeapMonth: false,
    gender: 'female',
    birthTime: '',
    hanjaName: '',
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate('/result', { state: form });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <Input
        label="이름"
        id="name"
        placeholder="예: 홍길동"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: sanitizeHangulInput(e.target.value) })}
        style={{ marginBottom: 16 }}
      />

      <label>양력 / 음력</label>
      <div className={styles.segment}>
        <button
          type="button"
          className={`${styles.segmentButton} ${form.calendarType === 'solar' ? styles.segmentActive : ''}`}
          onClick={() => setForm({ ...form, calendarType: 'solar', isLeapMonth: false })}
        >
          양력
        </button>
        <button
          type="button"
          className={`${styles.segmentButton} ${form.calendarType === 'lunar' ? styles.segmentActive : ''}`}
          onClick={() => setForm({ ...form, calendarType: 'lunar' })}
        >
          음력
        </button>
      </div>

      <Input
        label="생년월일"
        id="birthDate"
        type="date"
        required
        value={form.birthDate}
        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        style={{ marginBottom: form.calendarType === 'lunar' ? 8 : 16 }}
      />

      {form.calendarType === 'lunar' && (
        <label className={styles.leapRow}>
          <input
            type="checkbox"
            checked={form.isLeapMonth}
            onChange={(e) => setForm({ ...form, isLeapMonth: e.target.checked })}
          />
          윤달이에요
        </label>
      )}

      <div style={{ marginBottom: 16 }}>
        <Select
          label="성별"
          id="gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value as FortuneInput['gender'] })}
          options={[
            { value: 'female', label: '여성' },
            { value: 'male', label: '남성' },
          ]}
        />
      </div>
      <Input
        label="태어난 시간"
        id="birthTime"
        type="time"
        value={form.birthTime}
        onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
        style={{ marginBottom: 16 }}
      />

      <Input
        label="한자 이름 (선택)"
        id="hanjaName"
        placeholder="예: 金敏秀"
        value={form.hanjaName}
        onChange={(e) => setForm({ ...form, hanjaName: sanitizeHanjaInput(e.target.value) })}
        style={{ marginBottom: 4 }}
      />
      <p className={styles.hint}>한자만 입력할 수 있어요. 입력하시면 이름의 오행까지 함께 풀이해드려요.</p>

      <Button type="submit" style={{ marginTop: 8 }}>
        운세 보기
      </Button>
    </form>
  );
}
