import {
  ELEMENT_CAUTION,
  ELEMENT_FLAVOR,
  ELEMENT_PERSONALITY,
  getDayPillar,
  getElementRelation,
  getStemYinYang,
  shiftDate,
  todayDateString,
  type DayPillar,
  type ElementRelation,
} from './sajuKnowledge';
import { lunarToSolar, formatSolarDate } from '../lib/lunarCalendar';
import {
  analyzeHanjaName,
  getElementRelation as getNameRelation,
  RELATION_COMMENT,
  type NameAnalysis,
} from '../lib/hanjaAnalysis';

export interface FortuneInput {
  name: string;
  birthDate: string;
  calendarType: 'solar' | 'lunar';
  isLeapMonth: boolean;
  gender: 'male' | 'female';
  birthTime: string;
  hanjaName: string;
}

export interface FortuneCategoryResult {
  key: 'wealth' | 'love' | 'work' | 'health';
  label: string;
  emoji: string;
  score: number;
}

export interface NearTermTrendPoint {
  label: string;
  dateLabel: string;
  ganji: string;
  trend: '상승' | '보합' | '주의';
  note: string;
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
  dayYinYang: '양' | '음' | null;
  nameAnalysis: NameAnalysis | null;
  nameRelationComment: string | null;
  todayPillar: DayPillar | null;
  todayRelationComment: string | null;
  gains: string | null;
  losses: string | null;
  nearTermTrend: NearTermTrendPoint[] | null;
}

const SUMMARIES = [
  '오늘은 막혔던 일이 예상 밖의 계기로 풀려나가는 하루예요. 며칠째 제자리걸음이던 문제가 우연한 만남이나 사소한 대화 한마디로 실마리를 찾을 수 있으니, 조급해하지 않아도 좋은 흐름이 자연스럽게 따라옵니다. 지금 당장 눈에 보이는 성과가 없더라도, 그동안 쌓아온 것들이 물밑에서 조용히 방향을 잡아가고 있는 시기예요.',
  '주변 사람과의 대화 속에서 뜻밖의 힌트를 얻게 되는 하루예요. 무심코 들은 이야기나 스쳐 지나가는 조언 속에 지금 그대에게 꼭 필요한 실마리가 숨어 있을 수 있으니, 귀를 열고 있으면 좋은 기회를 놓치지 않을 거예요. 특히 평소 소원했던 사람과의 짧은 연락이 생각보다 큰 의미로 다가올 수 있는 날이에요.',
  '차분히 다져온 노력이 서서히 결실을 보이는 시기예요. 남들 눈엔 크게 달라진 게 없어 보여도, 그대가 묵묵히 쌓아온 시간이 조금씩 형태를 갖춰가고 있으니 눈앞의 결과보다 지금의 과정에 집중하면 마음이 한결 편안해집니다. 서두르지 않아도 늦지 않는 흐름이니 스스로를 믿고 계속 나아가세요.',
  '작은 변화가 큰 흐름을 바꾸는 하루예요. 늘 다니던 길을 조금 돌아가거나, 익숙한 방식을 잠시 내려놓고 새로운 시도를 해보는 것만으로도 생각지 못한 좋은 결과와 만날 수 있어요. 오늘 하루는 평소의 틀에서 살짝 벗어나 보는 것을 두려워하지 마세요.',
];

const SCORE_BAND_INTRO = {
  high: (name: string, ganji: string) => `${name}님, ${ganji}의 기운을 타고난 오늘은 전반적인 흐름이 유독 맑고 순탄한 하루예요.`,
  mid: (name: string, ganji: string) =>
    `${name}님, ${ganji}의 기운을 타고난 오늘은 크게 나쁘지도 특별히 들뜨지도 않은 무난하고 안정적인 흐름이에요.`,
  low: (name: string, ganji: string) =>
    `${name}님, ${ganji}의 기운을 타고난 오늘은 평소보다 조금 신중하게 움직여야 하는 잔잔한 흐름이에요.`,
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

/** 오늘의 일진(첫 번째)과 일간(두 번째) 관계가 종합운 점수에 주는 보정치 */
const SCORE_MODIFIER: Record<ElementRelation, number> = {
  firstGeneratesSecond: 22,
  secondGeneratesFirst: 2,
  same: 8,
  firstOvercomesSecond: -18,
  secondOvercomesFirst: 10,
};

const TODAY_RELATION_COMMENT: Record<ElementRelation, (today: string, day: string) => string> = {
  firstGeneratesSecond: (t, d) =>
    `오늘의 기운(${t})이 그대의 일간(${d})을 북돋아주는 상생의 날이에요. 귀인의 도움이나 뜻밖의 좋은 소식이 들어올 수 있고, 막혀 있던 일은 자연스럽게 풀려나갈 거예요.`,
  secondGeneratesFirst: (t, d) =>
    `그대의 일간(${d})이 오늘의 기운(${t})에 힘을 나눠주는 날이에요. 애쓴 만큼 바로 돌아오진 않아도, 오늘 나눈 마음과 노력은 시간이 지나 좋은 결실로 돌아올 거예요.`,
  same: (t, d) =>
    `오늘의 기운과 그대의 일간이 같은 ${d}(五行)으로 만나 본래의 기질이 한층 강해지는 날이에요(${t} · ${d} 비화). 뜻을 밀어붙이기엔 좋지만, 고집이나 과욕은 살짝 내려놓는 게 이로워요.`,
  firstOvercomesSecond: (t, d) =>
    `오늘의 기운(${t})이 그대의 일간(${d})을 누르는 상극의 날이에요. 예상 밖의 부담이나 지출이 들어올 수 있으니, 무리한 결정이나 새로운 시작은 하루 미루는 게 낫겠어요.`,
  secondOvercomesFirst: (t, d) =>
    `그대의 일간(${d})이 오늘의 기운(${t})을 다스리는 날이에요. 주도권을 쥐고 움직이기 좋은 날이라, 미뤄왔던 결정을 내리거나 원하는 것을 밀어붙이기에 유리해요.`,
};

const INCOMING_OUTGOING: Record<ElementRelation, { gains: string; losses: string }> = {
  firstGeneratesSecond: { gains: '귀인의 도움, 뜻밖의 좋은 소식, 새로운 기회', losses: '오래 붙잡고 있던 걱정과 막막함' },
  secondGeneratesFirst: { gains: '애쓴 만큼의 작은 성과, 좋은 인연의 씨앗', losses: '체력과 에너지, 여윳돈' },
  same: { gains: '추진력과 결단력, 뜻을 함께할 사람', losses: '우유부단함, 눈치 보던 마음' },
  firstOvercomesSecond: { gains: '예상 밖의 부담, 갑작스러운 지출이나 요구', losses: '자신감, 마음의 여유' },
  secondOvercomesFirst: { gains: '주도권, 원하는 결과', losses: '불필요한 눈치와 미련' },
};

const NEAR_TERM_NOTE: Record<ElementRelation, string> = {
  firstGeneratesSecond: '주변의 도움을 받아 순조롭게 흘러가는 시기예요.',
  secondGeneratesFirst: '베푸는 만큼 천천히 결실이 쌓이는 시기예요.',
  same: '뜻을 밀어붙이기 좋지만 과욕은 주의할 시기예요.',
  firstOvercomesSecond: '부담과 압박이 늘어 신중해야 할 시기예요.',
  secondOvercomesFirst: '주도권을 쥐고 유리하게 이끌어갈 시기예요.',
};

function trendLabel(modifier: number): '상승' | '보합' | '주의' {
  if (modifier >= 15) return '상승';
  if (modifier <= -10) return '주의';
  return '보합';
}

function formatMonthDay(dateString: string): string {
  const [, m, d] = dateString.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}

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

function resolveSolarBirthDate(input: FortuneInput): string | null {
  if (input.calendarType === 'solar') return input.birthDate;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!match) return null;
  const [, y, m, d] = match;

  const solar = lunarToSolar(Number(y), Number(m), Number(d), input.isLeapMonth);
  return solar ? formatSolarDate(solar) : null;
}

export function generateDummyFortune(input: FortuneInput): FortuneResult {
  const seed = hashSeed(`${input.name}-${input.birthDate}-${input.calendarType}-${input.gender}-${input.birthTime}`);

  const solarBirthDate = resolveSolarBirthDate(input);
  const dayPillar = solarBirthDate ? getDayPillar(solarBirthDate) : null;
  const dayYinYang = dayPillar ? getStemYinYang(dayPillar.stem) : null;

  const today = todayDateString();
  const todayPillar = getDayPillar(today);

  const relation = dayPillar && todayPillar ? getElementRelation(todayPillar.element, dayPillar.element) : null;
  const scoreModifier = relation ? SCORE_MODIFIER[relation] : 0;

  const baseScore = 45 + (seed % 20);
  const overallScore = Math.min(99, Math.max(5, baseScore + scoreModifier));

  const categories = CATEGORY_META.map((meta, index) => ({
    ...meta,
    score: Math.min(99, Math.max(5, 50 + ((seed + index * 17) % 36) + Math.round(scoreModifier / 2))),
  }));

  const scoreBand = overallScore >= 80 ? 'high' : overallScore >= 68 ? 'mid' : 'low';
  const intro = dayPillar ? SCORE_BAND_INTRO[scoreBand](input.name, dayPillar.ganji) : '';
  const summary = dayPillar
    ? `${intro} ${pick(SUMMARIES, seed, 0)} ${ELEMENT_FLAVOR[dayPillar.element]}`
    : `${input.name}님, ${pick(SUMMARIES, seed, 0)}`;

  const todayRelationComment =
    relation && dayPillar && todayPillar ? TODAY_RELATION_COMMENT[relation](todayPillar.element, dayPillar.element) : null;
  const gains = relation ? INCOMING_OUTGOING[relation].gains : null;
  const losses = relation ? INCOMING_OUTGOING[relation].losses : null;

  // 천간은 10일 주기로 순환하므로, 10의 배수 간격은 매번 같은 천간(같은 오행)을 가리켜요.
  // 서로 다른 흐름을 보여주기 위해 10으로 나눈 나머지가 겹치지 않는 간격을 사용해요.
  const nearTermTrend: NearTermTrendPoint[] | null = dayPillar
    ? ([
        [7, '가까운 시일'],
        [18, '한 달 안'],
        [32, '한 달 뒤'],
      ] as const).map(([offset, label]) => {
        const futureDate = shiftDate(today, offset);
        const futurePillar = getDayPillar(futureDate);
        const futureRelation = futurePillar ? getElementRelation(futurePillar.element, dayPillar.element) : 'same';
        return {
          label,
          dateLabel: formatMonthDay(futureDate),
          ganji: futurePillar?.ganji ?? '',
          trend: trendLabel(SCORE_MODIFIER[futureRelation]),
          note: NEAR_TERM_NOTE[futureRelation],
        };
      })
    : null;

  const nameAnalysis = analyzeHanjaName(input.hanjaName);
  const nameRelationComment =
    dayPillar && nameAnalysis
      ? RELATION_COMMENT[getNameRelation(dayPillar.element, nameAnalysis.element)](dayPillar.element, nameAnalysis.element)
      : null;

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
    dayYinYang,
    nameAnalysis,
    nameRelationComment,
    todayPillar,
    todayRelationComment,
    gains,
    losses,
    nearTermTrend,
  };
}

/** 결과 페이지를 링크로 공유할 수 있도록 입력값을 URL 쿼리로 변환해요. */
export function encodeFortuneInput(input: FortuneInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set('name', input.name);
  params.set('birthDate', input.birthDate);
  params.set('calendarType', input.calendarType);
  if (input.isLeapMonth) params.set('isLeapMonth', '1');
  params.set('gender', input.gender);
  if (input.birthTime) params.set('birthTime', input.birthTime);
  if (input.hanjaName) params.set('hanjaName', input.hanjaName);
  return params;
}

/** URL 쿼리로 전달된 값을 다시 FortuneInput으로 복원해요. 필수값이 없으면 null이에요. */
export function decodeFortuneInput(params: URLSearchParams): FortuneInput | null {
  const birthDate = params.get('birthDate');
  const name = params.get('name');
  if (!birthDate || !name) return null;

  return {
    name,
    birthDate,
    calendarType: params.get('calendarType') === 'lunar' ? 'lunar' : 'solar',
    isLeapMonth: params.get('isLeapMonth') === '1',
    gender: params.get('gender') === 'male' ? 'male' : 'female',
    birthTime: params.get('birthTime') ?? '',
    hanjaName: params.get('hanjaName') ?? '',
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
