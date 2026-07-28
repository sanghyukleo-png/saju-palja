export interface DayPillar {
  stem: string;
  branch: string;
  element: '목' | '화' | '토' | '금' | '수';
  elementHanja: string;
  ganji: string;
}

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const STEM_ELEMENT: Record<string, { element: DayPillar['element']; hanja: string }> = {
  갑: { element: '목', hanja: '木' },
  을: { element: '목', hanja: '木' },
  병: { element: '화', hanja: '火' },
  정: { element: '화', hanja: '火' },
  무: { element: '토', hanja: '土' },
  기: { element: '토', hanja: '土' },
  경: { element: '금', hanja: '金' },
  신: { element: '금', hanja: '金' },
  임: { element: '수', hanja: '水' },
  계: { element: '수', hanja: '水' },
};

/** 그레고리력 날짜를 율리우스일(JDN)로 변환 (Fliegel & Van Flandern 공식) */
function toJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * 생년월일로 일주(日柱, 태어난 날의 간지)를 계산해요.
 * 60갑자는 60일 주기로 반복되므로 JDN을 60으로 나눈 나머지로 구할 수 있어요.
 * 정확한 사주 만세력은 절기·자시 기준 보정이 추가로 필요하지만, 데모에서는 이 간단한 방식을 사용해요.
 */
export function getDayPillar(birthDate: string): DayPillar | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return null;

  const [, y, m, d] = match;
  const jdn = toJulianDayNumber(Number(y), Number(m), Number(d));

  const stem = STEMS[((jdn + 9) % 10 + 10) % 10];
  const branch = BRANCHES[((jdn + 1) % 12 + 12) % 12];
  const meta = STEM_ELEMENT[stem];

  return {
    stem,
    branch,
    element: meta.element,
    elementHanja: meta.hanja,
    ganji: `${stem}${branch}`,
  };
}

export const ELEMENT_FLAVOR: Record<DayPillar['element'], string> = {
  목: '나무처럼 뻗어나가는 성장의 기운이 강해서, 새로운 시작이나 확장을 시도하기 좋은 흐름이에요.',
  화: '타오르는 불의 기운이 활발해서, 사람들 앞에 나서거나 적극적으로 표현할수록 운이 따라와요.',
  토: '든든한 땅의 기운이 자리를 잡아주는 시기라, 서두르기보다 기반을 다지는 데 집중하면 좋아요.',
  금: '단단한 쇠의 기운이 결단력을 더해줘서, 맺고 끊을 일은 미루지 않는 게 유리해요.',
  수: '흐르는 물의 기운이 유연함을 더해줘서, 상황에 맞춰 유연하게 대응할수록 좋은 결과가 따라와요.',
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '사주팔자(四柱八字)란 무엇인가요?',
    answer:
      '태어난 연·월·일·시를 각각 하늘의 기운(천간)과 땅의 기운(지지)으로 나타낸 여덟 글자예요. 이 여덟 글자의 조합으로 타고난 기운의 균형을 살펴보는 것이 사주명리학의 기본 원리예요.',
  },
  {
    question: '오행(五行)이 뭔가요?',
    answer:
      '목(木)·화(火)·토(土)·금(金)·수(水), 다섯 가지 기운을 말해요. 나무가 자라 불을 지피고(목생화), 불이 재가 되어 흙이 되고(화생토) 하는 식으로 서로 돕고(상생) 견제하는(상극) 관계를 통해 사람의 성향과 흐름을 설명해요.',
  },
  {
    question: '일간(日干)은 왜 중요한가요?',
    answer:
      '사주 여덟 글자 중 태어난 날의 천간을 일간이라고 해요. 사주 해석에서 \'나 자신\'을 상징하는 기준점이 되기 때문에, 일간이 어떤 오행인지에 따라 성향과 오늘의 운 흐름을 다르게 풀이해요.',
  },
  {
    question: '십성(十星)이란 무엇인가요?',
    answer:
      '일간과 다른 글자 사이의 관계를 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 열 가지로 나눈 개념이에요. 성격, 대인관계, 재물운, 직업운 등을 세밀하게 풀이할 때 활용돼요.',
  },
  {
    question: '대운(大運)과 세운(歲運)은 어떻게 다른가요?',
    answer:
      '대운은 보통 10년 단위로 바뀌는 큰 흐름의 운이고, 세운은 한 해 단위로 바뀌는 운이에요. 타고난 사주(원국)에 대운과 세운이 겹치면서 그 시기의 전반적인 기운이 만들어져요.',
  },
  {
    question: '이 앱의 운세는 정식 사주 상담과 같은가요?',
    answer:
      '아니에요. 이 앱은 데모 버전으로, 정밀한 만세력 계산 대신 생년월일 기반의 간단한 규칙으로 재미로 볼 수 있는 결과를 생성해요. 인생의 중요한 결정은 전문 상담가와 상의하시길 권장해요.',
  },
];
