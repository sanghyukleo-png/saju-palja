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
  '오늘은 막혔던 일이 예상 밖의 계기로 풀려나가는 하루예요. 조급해하지 않아도 좋은 흐름이 자연스럽게 따라옵니다.',
  '주변 사람과의 대화 속에서 뜻밖의 힌트를 얻게 돼요. 귀를 열고 있으면 좋은 기회를 놓치지 않을 거예요.',
  '차분히 다져온 노력이 서서히 결실을 보이는 시기예요. 눈앞의 결과보다 과정에 집중하면 마음이 편안해집니다.',
  '작은 변화가 큰 흐름을 바꾸는 하루예요. 익숙한 방식을 잠시 내려놓고 새로운 시도를 해보는 것도 좋아요.',
];

const ADVICE = [
  '오늘은 평소보다 한 박자 천천히 움직여 보세요. 서두르지 않을수록 원하는 결과에 가까워집니다.',
  '마음이 흔들릴 땐 가까운 사람에게 솔직하게 털어놓아 보세요. 뜻밖의 위로와 조언을 얻게 될 거예요.',
  '작은 결정 하나가 하루의 분위기를 바꿉니다. 직감을 믿고 가볍게 움직여 보세요.',
  '무리한 약속보다는 스스로를 돌보는 시간을 우선순위에 두는 게 좋겠어요.',
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
  const summary = dayPillar
    ? `${pick(SUMMARIES, seed, 0)} ${ELEMENT_FLAVOR[dayPillar.element]}`
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
