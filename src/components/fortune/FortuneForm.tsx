import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { FortuneInput } from '../../data/dummyFortune';

export function FortuneForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FortuneInput>({
    birthDate: '',
    gender: 'female',
    birthTime: '',
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate('/result', { state: form });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <Input
        label="생년월일"
        id="birthDate"
        type="date"
        required
        value={form.birthDate}
        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        style={{ marginBottom: 16 }}
      />
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
        style={{ marginBottom: 24 }}
      />
      <Button type="submit">운세 보기</Button>
    </form>
  );
}
