import { FortuneForm } from '../components/fortune/FortuneForm';
import { PersonaIntro } from '../components/fortune/PersonaIntro';

export function Home() {
  return (
    <section>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <h1>사주팔자 운세보기</h1>
        <p>생년월일을 알려주시면 오늘의 운세를 봐드립니다</p>
      </div>
      <PersonaIntro />
      <FortuneForm />
    </section>
  );
}
