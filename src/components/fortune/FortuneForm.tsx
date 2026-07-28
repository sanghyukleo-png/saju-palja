import { useState, type ChangeEvent, type CompositionEvent, type FormEvent } from 'react';
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

  const [name, setName] = useState('');
  const [isNameComposing, setIsNameComposing] = useState(false);

  const [hanjaName, setHanjaName] = useState('');
  const [isHanjaComposing, setIsHanjaComposing] = useState(false);

  const [calendarType, setCalendarType] = useState<FortuneInput['calendarType']>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const [gender, setGender] = useState<FortuneInput['gender']>('female');

  const [ampm, setAmpm] = useState<'am' | 'pm'>('am');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    // 조합 중에는 state를 건드리지 않아요. 모바일에서 조합 중 리렌더가 일어나면
    // 키보드의 한글 조합(초성·중성·종성)이 끊기는 기기가 있어서, 조합이 끝난 뒤에만 반영해요.
    if (isNameComposing) return;
    setName(sanitizeHangulInput(e.target.value));
  }

  function handleNameCompositionEnd(e: CompositionEvent<HTMLInputElement>) {
    setIsNameComposing(false);
    setName(sanitizeHangulInput(e.currentTarget.value));
  }

  function handleHanjaChange(e: ChangeEvent<HTMLInputElement>) {
    if (isHanjaComposing) return;
    setHanjaName(sanitizeHanjaInput(e.target.value));
  }

  function handleHanjaCompositionEnd(e: CompositionEvent<HTMLInputElement>) {
    setIsHanjaComposing(false);
    setHanjaName(sanitizeHanjaInput(e.currentTarget.value));
  }

  function buildBirthDate(): string {
    if (!birthYear || !birthMonth || !birthDay) return '';
    return `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
  }

  function buildBirthTime(): string {
    if (!birthHour || !birthMinute) return '';
    let hour24 = Number(birthHour) % 12;
    if (ampm === 'pm') hour24 += 12;
    return `${String(hour24).padStart(2, '0')}:${birthMinute.padStart(2, '0')}`;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const input: FortuneInput = {
      name,
      birthDate: buildBirthDate(),
      calendarType,
      isLeapMonth,
      gender,
      birthTime: buildBirthTime(),
      hanjaName,
    };
    navigate('/result', { state: input });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <Input
        label="이름"
        id="name"
        placeholder="예: 홍길동"
        required
        value={name}
        onChange={handleNameChange}
        onCompositionStart={() => setIsNameComposing(true)}
        onCompositionEnd={handleNameCompositionEnd}
        style={{ marginBottom: 16 }}
      />

      <label>양력 / 음력</label>
      <div className={styles.segment}>
        <button
          type="button"
          className={`${styles.segmentButton} ${calendarType === 'solar' ? styles.segmentActive : ''}`}
          onClick={() => {
            setCalendarType('solar');
            setIsLeapMonth(false);
          }}
        >
          양력
        </button>
        <button
          type="button"
          className={`${styles.segmentButton} ${calendarType === 'lunar' ? styles.segmentActive : ''}`}
          onClick={() => setCalendarType('lunar')}
        >
          음력
        </button>
      </div>

      <label>생년월일</label>
      <div className={styles.fieldRow}>
        <div className={styles.fieldBox}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="1990"
            min={1900}
            max={2035}
            required
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
          <span className={styles.fieldUnit}>년</span>
        </div>
        <div className={styles.fieldBox}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="1"
            min={1}
            max={12}
            required
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
          />
          <span className={styles.fieldUnit}>월</span>
        </div>
        <div className={styles.fieldBox}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="1"
            min={1}
            max={31}
            required
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          />
          <span className={styles.fieldUnit}>일</span>
        </div>
      </div>

      {calendarType === 'lunar' && (
        <label className={styles.leapRow}>
          <input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} />
          윤달이에요
        </label>
      )}

      <div style={{ marginBottom: 16 }}>
        <Select
          label="성별"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as FortuneInput['gender'])}
          options={[
            { value: 'female', label: '여성' },
            { value: 'male', label: '남성' },
          ]}
        />
      </div>

      <label>태어난 시간 (선택)</label>
      <div className={styles.segment}>
        <button
          type="button"
          className={`${styles.segmentButton} ${ampm === 'am' ? styles.segmentActive : ''}`}
          onClick={() => setAmpm('am')}
        >
          오전
        </button>
        <button
          type="button"
          className={`${styles.segmentButton} ${ampm === 'pm' ? styles.segmentActive : ''}`}
          onClick={() => setAmpm('pm')}
        >
          오후
        </button>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldBox}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="12"
            min={1}
            max={12}
            value={birthHour}
            onChange={(e) => setBirthHour(e.target.value)}
          />
          <span className={styles.fieldUnit}>시</span>
        </div>
        <div className={styles.fieldBox}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            min={0}
            max={59}
            value={birthMinute}
            onChange={(e) => setBirthMinute(e.target.value)}
          />
          <span className={styles.fieldUnit}>분</span>
        </div>
      </div>

      <Input
        label="한자 이름 (선택)"
        id="hanjaName"
        placeholder="예: 金敏秀"
        value={hanjaName}
        onChange={handleHanjaChange}
        onCompositionStart={() => setIsHanjaComposing(true)}
        onCompositionEnd={handleHanjaCompositionEnd}
        style={{ marginBottom: 4 }}
      />
      <p className={styles.hint}>한자만 입력할 수 있어요. 입력하시면 이름의 오행까지 함께 풀이해드려요.</p>

      <Button type="submit" style={{ marginTop: 8 }}>
        운세 보기
      </Button>
    </form>
  );
}
