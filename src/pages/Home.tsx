import { FortuneForm } from '../components/fortune/FortuneForm';
import { PersonaIntro } from '../components/fortune/PersonaIntro';
import { Hero } from '../components/fortune/Hero';

export function Home() {
  return (
    <section>
      <Hero
        eyebrow="간지(干支)로 정성껏 풀이하는"
        title={['당신의 사주,', '운명의 흐름을 읽다']}
        subtitle="사주팔자 속에 담긴 당신의 운명, 지금 그 이야기를 시작합니다"
      />
      <PersonaIntro />
      <FortuneForm />
    </section>
  );
}
