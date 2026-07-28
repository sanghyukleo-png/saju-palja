import { FortuneForm } from '../components/fortune/FortuneForm';

export function Home() {
  return (
    <section>
      <div className="text-center" style={{ marginBottom: 28 }}>
        <h1>🔮 AI 사주</h1>
        <p>오늘의 운세를 확인해보세요</p>
      </div>
      <FortuneForm />
    </section>
  );
}
