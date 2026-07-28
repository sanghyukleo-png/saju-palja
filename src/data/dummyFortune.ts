import { ELEMENT_CAUTION, ELEMENT_FLAVOR, ELEMENT_PERSONALITY, getDayPillar, type DayPillar } from './sajuKnowledge';

export interface FortuneInput {
  birthDate: string;
  gender: 'male' | 'female';
  birthTime: string;
}

export interface FortuneCategoryResult {
  key: 'wealth' | 'love' | 'work' | 'health';
  label: string;
  emoji: string;
  score: number;
}

export interface FortuneResult {
  overallScore: number;
  summary: string;
  categories: FortuneCategoryResult[];
  luckyColor: string;
  luckyNumber: number;
  advice: string;
  caution: string;
  personality: string;
  dayPillar: DayPillar | null;
}

const SUMMARIES = [
  '오늘은 막혔던 일이 예상 밖의 계기로 풀려나가는 하루예요. 며칠째 제자리걸음이던 문제가 우연한 만남이나 사소한 대화 한마디로 실마리를 찾을 수 있으니, 조급해하지 않아도 좋은 흐름이 자연스럽게 따라옵니다. 지금 당장 눈에 보이는 성과가 없더라도, 그동안 쌓아온 것들이 물밑에서 조용히 방향을 잡아가고 있는 시기예요.',
  '주변 사람과의 대화 속에서 뜻밖의 힌트를 얻게 되는 하루예요. 무심코 들은 이야기나 스쳐 지나가는 조언 속에 지금 그대에게 꼭 필요한 실마리가 숨어 있을 수 있으니, 귀를 열고 있으면 좋은 기회를 놓치지 않을 거예요. 특히 평소 소원했던 사람과의 짧은 연락이 생각보다 큰 의미로 다가올 수 있는 날이에요.',
  '차분히 다져온 노력이 서서히 결실을 보이는 시기예요. 남들 눈엔 크게 달라진 게 없어 보여도, 그대가 묵묵히 쌓아온 시간이 조금씩 형태를 갖춰가고 있으니 눈앞의 결과보다 지금의 과정에 집중하면 마음이 한결 편안해집니다. 서두르지 않아도 늦지 않는 흐름이니 스스로를 믿고 계속 나아가세요.',
  '작은 변화가 큰 흐름을 바꾸는 하루예요. 늘 다니던 길을 조금 돌아가거나, 익숙한 방식을 잠시 내려놓고 새로운 시도를 해보는 것만으로도 생각지 못한 좋은 결과와 만날 수 있어요. 오늘 하루는 평소의 틀에서 살짝 벗어나 보는 것을 두려워하지 마세요.',
];

const SCORE_BAND_INTRO = {
  high: (ganji: string) => `${ganji}의 기운을 타고난 오늘, 전반적인 흐름이 유독 맑고 순탄한 하루예요.`,
  mid: (ganji: string) => `${ganji}의 기운을 타고난 오늘은, 크게 나쁘지도 특별히 들뜨지도 않은 무난하고 안정적인 흐름이에요.`,
  low: (ganji: string) => `${ganji}의 기운을 타고난 오늘은, 평소보다 조금 신중하게 움직여야 하는 잔잔한 흐름이에요.`,
};

const ADVICE = [
  '오늘은 평소보다 한 박자 천천히 움직여 보세요. 서두르면 놓치기 쉬운 세부적인 것들이 오늘따라 유독 중요한 의미를 지니고 있어서, 여유를 갖고 하나씩 짚어갈수록 원하는 결과에 더 가까워집니다. 급한 마음이 들 때일수록 잠시 숨을 고르고 다시 살펴보는 습관을 들여보세요.',
  '마음이 흔들릴 땐 가까운 사람에게 솔직하게 털어놓아 보세요. 혼자 끙끙 앓기보다 믿을 만한 사람과 나눈 대화 속에서 뜻밖의 위로와 조언을 얻게 될 거예요. 오늘은 특히 그 사람의 사소한 한마디가 오래도록 마음에 남을 수 있는 날이에요.',
  '작은 결정 하나가 하루의 분위기를 좌우합니다. 지나치게 재고 따지기보다 직감을 믿고 가볍게 움직여 보세요. 완벽한 타이밍을 기다리다 놓치는 것보다, 지금 이 순간의 선택이 더 나은 결과로 이어질 가능성이 커요.',
  '무리한 약속이나 무리한 일정보다는 스스로를 돌보는 시간을 우선순위에 두는 게 좋겠어요. 몸과 마음이 지친 상태로는 좋은 기회가 와도 온전히 붙잡기 어려우니, 오늘 하루만큼은 나 자신을 먼저 챙기는 것이 결국 더 멀리 가는 길이 될 거예요.',
];

const COLORS = ['보라', '남색', '금색', '초록', '하늘색'];

const FALLBACK_CAUTION = '오늘은 서두르면 그르치기 쉬운 날이니, 중요한 결정은 한 번 더 살피고 내리시게.';
const FALLBACK_PERSONALITY = '그대의 사주는 아직 다 헤아리지 못했으나, 꾸준히 정진하는 기운만은 뚜렷하구려.';

const CATEGORY_META: { key: FortuneCategoryResult['key']; label: string; emoji: string }[] = [
  { key: 'wealth', label: '재물운', emoji: '💰' },
  { key: 'love', label: '연애운', emoji: '❤️' },
  { key: 'work', label: '직장운', emoji: '💼' },
  { key: 'health', label: '건강운', emoji: '🏥' },
];

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 100000;
  }
  return hash;
}

function pick<T>(list: T[], seed: number, salt: number): T {
  return list[(seed + salt) % list.length];
}

export function generateDummyFortune(input: FortuneInput): FortuneResult {
  const seed = hashSeed(`${input.birthDate}-${input.gender}-${input.birthTime}`);

  const overallScore = 60 + (seed % 36);
  const categories = CATEGORY_META.map((meta, index) => ({
    ...meta,
    score: 55 + ((seed + index * 17) % 41),
  }));

  const dayPillar = getDayPillar(input.birthDate);
  const scoreBand = overallScore >= 80 ? 'high' : overallScore >= 68 ? 'mid' : 'low';
  const intro = dayPillar ? SCORE_BAND_INTRO[scoreBand](dayPillar.ganji) : '';
  const summary = dayPillar
    ? `${intro} ${pick(SUMMARIES, seed, 0)} ${ELEMENT_FLAVOR[dayPillar.element]}`
    : pick(SUMMARIES, seed, 0);

  return {
    overallScore,
    summary,
    categories,
    luckyColor: pick(COLORS, seed, 1),
    luckyNumber: 1 + ((seed + 3) % 45),
    advice: pick(ADVICE, seed, 2),
    caution: dayPillar ? ELEMENT_CAUTION[dayPillar.element] : FALLBACK_CAUTION,
    personality: dayPillar ? ELEMENT_PERSONALITY[dayPillar.element] : FALLBACK_PERSONALITY,
    dayPillar,
  };
}

export interface FortuneHistoryEntry {
  id: string;
  date: string;
  overallScore: number;
  summary: string;
}

export const DUMMY_HISTORY: FortuneHistoryEntry[] = [
  { id: '1', date: '2026-07-28', overallScore: 88, summary: '막혔던 일이 예상 밖의 계기로 풀려나가는 하루' },
  { id: '2', date: '2026-07-21', overallScore: 74, summary: '주변 사람과의 대화에서 뜻밖의 힌트를 얻는 하루' },
  { id: '3', date: '2026-07-14', overallScore: 65, summary: '차분히 다져온 노력이 서서히 결실을 보이는 시기' },
  { id: '4', date: '2026-07-07', overallScore: 91, summary: '작은 변화가 큰 흐름을 바꾸는 하루' },
  { id: '5', date: '2026-06-30', overallScore: 70, summary: '무리한 약속보다 스스로를 돌보는 시간이 필요한 시기' },
];
