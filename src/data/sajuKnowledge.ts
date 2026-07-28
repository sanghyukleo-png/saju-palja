export interface DayPillar {
  stem: string;
  branch: string;
  element: '목' | '화' | '토' | '금' | '수';
  elementHanja: string;
  stemHanja: string;
  stemMeaning: string;
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

/** 십간(十干)의 한자와 훈음 — 자원(字源)상의 전통적 의미 */
export const STEM_MEANING: Record<string, { hanja: string; meaning: string }> = {
  갑: { hanja: '甲', meaning: '첫째 갑 · 씨앗의 껍질을 뚫고 나오는 새싹' },
  을: { hanja: '乙', meaning: '둘째 을 · 굽어 자라나는 여린 새싹' },
  병: { hanja: '丙', meaning: '셋째 병 · 밝게 타오르는 빛' },
  정: { hanja: '丁', meaning: '넷째 정 · 장성하여 단단해진 것' },
  무: { hanja: '戊', meaning: '다섯째 무 · 무성하게 우거짐' },
  기: { hanja: '己', meaning: '여섯째 기 · 자기 자신, 정리된 몸' },
  경: { hanja: '庚', meaning: '일곱째 경 · 결실을 맺고 단단해짐' },
  신: { hanja: '辛', meaning: '여덟째 신 · 매섭게 여물어감' },
  임: { hanja: '壬', meaning: '아홉째 임 · 안에 품어 잉태함' },
  계: { hanja: '癸', meaning: '열째 계 · 헤아려 다음을 준비함' },
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
  const stemMeta = STEM_MEANING[stem];

  return {
    stem,
    branch,
    element: meta.element,
    elementHanja: meta.hanja,
    stemHanja: stemMeta.hanja,
    stemMeaning: stemMeta.meaning,
    ganji: `${stem}${branch}`,
  };
}

const YANG_STEMS = new Set(['갑', '병', '무', '경', '임']);

/** 천간의 음양(陰陽)을 판별해요. */
export function getStemYinYang(stem: string): '양' | '음' {
  return YANG_STEMS.has(stem) ? '양' : '음';
}

/** 오늘 날짜(YYYY-MM-DD)를 dateOffsetDays 만큼 이동한 날짜 문자열을 반환해요. */
export function shiftDate(dateString: string, dateOffsetDays: number): string {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + dateOffsetDays);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

type Element = DayPillar['element'];

export type ElementRelation =
  | 'same'
  | 'firstGeneratesSecond'
  | 'secondGeneratesFirst'
  | 'firstOvercomesSecond'
  | 'secondOvercomesFirst';

const GENERATES: Record<Element, Element> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
const OVERCOMES: Record<Element, Element> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };

/** 두 오행 사이의 상생(生)·상극(剋) 관계를 판별해요. */
export function getElementRelation(first: Element, second: Element): ElementRelation {
  if (first === second) return 'same';
  if (GENERATES[first] === second) return 'firstGeneratesSecond';
  if (GENERATES[second] === first) return 'secondGeneratesFirst';
  if (OVERCOMES[first] === second) return 'firstOvercomesSecond';
  return 'secondOvercomesFirst';
}

export const ELEMENT_FLAVOR: Record<DayPillar['element'], string> = {
  목: '나무처럼 뻗어나가는 성장의 기운이 유난히 강한 날이에요. 묵혀두었던 계획이 있다면 오늘 첫걸음을 떼기에 좋은 흐름이고, 배움이나 확장을 시도할수록 그 결실이 오래 갈 거예요. 다만 뻗어나가려는 마음이 앞서 주변을 살피지 못하는 순간도 있을 테니, 곁에 있는 사람들에게도 눈길을 나눠주세요.',
  화: '타오르는 불의 기운이 활발해지는 하루예요. 사람들 앞에 나서거나 생각을 적극적으로 표현할수록 좋은 운이 따라오고, 평소 망설이던 제안이나 고백을 꺼내기에도 나쁘지 않은 때예요. 다만 감정이 빠르게 끓어오르는 만큼 식는 것도 빠르니, 중요한 결정은 열기가 조금 가라앉은 뒤에 내리는 편이 좋겠어요.',
  토: '든든한 땅의 기운이 자리를 잡아주는 시기예요. 서두르기보다 기반을 다지는 데 집중할수록 성과가 오래가고, 묵묵히 해온 일들이 주변의 신뢰로 돌아오는 하루가 될 거예요. 다만 안정감에 기대어 변화를 미루다 보면 좋은 기회를 놓칠 수 있으니, 가끔은 익숙한 틀 밖으로 한 발 내디뎌 보세요.',
  금: '단단한 쇠의 기운이 결단력을 더해주는 하루예요. 오래 미뤄온 정리나 매듭지어야 할 일이 있다면 오늘 확실히 끝내는 게 유리하고, 원칙을 지키는 태도가 주변의 존중을 얻게 할 거예요. 다만 그 단호함이 지나치면 차갑게 비칠 수 있으니, 전하는 말에 온기를 조금 더 담아보세요.',
  수: '흐르는 물의 기운이 유연함을 더해주는 하루예요. 상황에 맞춰 계획을 바꾸거나 여러 사람의 의견을 두루 살피는 데 능한 흐름이라, 협업이나 조율이 필요한 자리에서 특히 빛을 발할 거예요. 다만 너무 여러 갈래로 마음이 흩어지면 정작 중요한 결정을 미루게 되니, 오늘만큼은 하나를 정해 밀고 나가 보세요.',
};

export const PERSONA = {
  name: '청운 도사',
  role: '사주 명리 대감',
};

/** 사주팔자 탭: 일간 오행에 따른 성정 풀이 (청운 도사 어투) */
export const ELEMENT_PERSONALITY: Record<DayPillar['element'], string> = {
  목: '그대의 일간은 나무의 기운을 타고났으니, 위로 뻗어나가려는 성장의 의지가 유난히 강한 사주로다. 새로운 것을 배우고 익히는 데 능하며, 한 번 마음먹은 길은 굽히지 않고 밀고 나가는 곧은 성정을 지녔소. 사람을 대할 때도 정직하고 올곧아 신뢰를 얻는 편이나, 때로는 융통성이 부족해 주변과 부딪히는 일도 있을 것이오. 이런 사주는 한 곳에 오래 머무르기보다, 배움과 도전이 있는 곳으로 나아갈 때 비로소 본래의 기운이 살아나니, 새 인연과 낯선 길을 두려워하지 마시게.',
  화: '그대의 일간은 불의 기운을 타고났으니, 밝고 정열적이며 사람을 끌어모으는 재주가 남다른 사주로다. 말과 표정에 감정이 잘 드러나 곁에 있는 이들에게 따뜻함을 전하는 힘이 있고, 무리를 이끄는 자리에서 특히 빛을 발하는 성정이오. 다만 타오르는 만큼 꺼지기도 쉬워, 시작한 일을 끝까지 이어가는 꾸준함이 부족할 때가 있으니 이를 경계해야 하오. 열정이 앞서는 날일수록 한 박자 늦춰 확인하는 습관을 벗 삼으시게.',
  토: '그대의 일간은 흙의 기운을 타고났으니, 묵묵하고 든든하여 주변이 절로 의지하게 되는 사주로다. 화려하게 드러내지 않아도 맡은 바를 끝까지 해내는 뚝심이 있어, 시간이 지날수록 그 진가를 알아보는 이들이 늘어날 것이오. 다만 변화보다 익숙함을 택하는 성정이 지나치면 좋은 기회조차 지나쳐 버릴 수 있으니, 가끔은 스스로 등 떠밀듯 새로운 길에 나서야 하오. 그 믿음직함을 지키되, 정체되지 않도록 스스로를 다독이시게.',
  금: '그대의 일간은 쇠의 기운을 타고났으니, 맺고 끊음이 분명하고 원칙을 지키는 강단이 있는 사주로다. 옳고 그름을 가리는 눈이 밝아 중요한 자리에서 신뢰받는 결정을 내리는 힘이 있고, 한 번 정한 기준은 쉽게 흔들리지 않는 성정이오. 다만 그 날카로움이 지나치면 곁을 내주기 어려운 사람으로 비칠 수 있으니, 부드러움을 함께 지니는 것이 긴 여정에 이롭소. 강단은 지키되, 전하는 말에는 온기를 담으시게.',
  수: '그대의 일간은 물의 기운을 타고났으니, 어디에도 잘 스며드는 지혜와 융통성을 갖춘 사주로다. 상황을 읽는 눈이 빠르고 사람과 사람 사이를 잇는 재주가 있어, 갈등이 있는 자리에서도 물 흐르듯 풀어내는 힘이 있소. 다만 너무 많은 것을 살피다 보면 정작 자신의 중심을 잃고 흔들릴 때가 있으니 이를 경계해야 하오. 흐르는 물처럼 막힘없이 나아가되, 중심에 놓인 뜻만큼은 굳게 지니시게.',
};

/** 조심할 것 탭: 일간 오행에 따른 주의사항 (청운 도사 어투) */
export const ELEMENT_CAUTION: Record<DayPillar['element'], string> = {
  목: '성장의 기운이 강한 만큼 욕심을 부리면 무리하기 쉬우니, 오늘은 한 걸음 물러서 살피시구려. 새로운 일을 벌이기 전에 이미 벌여둔 일부터 마무리하시게. 특히 가까운 이의 조언을 흘려듣지 마시게, 그 안에 그대가 놓친 것이 있을지 모르오.',
  화: '기운이 앞서 나가는 날이니 말이 앞서지 않도록 조심하시게. 감정이 격해지면 평소라면 넘어갈 일도 관계를 상하게 할 수 있소. 특히 홧김에 내린 결정은 하루 이틀 묵혀두었다가 다시 살펴보는 편이 훗날 후회를 줄여줄 것이오.',
  토: '든든함을 믿고 미루는 버릇을 조심하시오. 게으름이 좋은 기회를 놓치게 만들 수 있소이다. 오늘 해야 할 작은 일 하나를 내일로 미루면, 그것이 쌓여 큰 부담이 되어 돌아올 수 있으니 지금 바로 손을 대시게.',
  금: '결단이 지나치면 차갑다 오해받기 쉬우니, 전하는 말을 한 번 더 다듬으시게. 옳은 말도 때와 태도에 따라 다르게 가닿는 법이오. 특히 오늘은 원칙만 앞세우기보다 상대의 입장도 한 번 헤아려 보시게.',
  수: '유연함이 지나치면 우유부단해 보일 수 있으니, 오늘만큼은 뜻을 분명히 하시구려. 여러 갈래로 흩어진 마음을 하나로 모으지 않으면, 좋은 기회가 와도 붙잡지 못하고 흘려보내게 되오. 결정을 미루기보다 오늘 하나를 정해 밀고 나가시게.',
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
    question: '한자 이름을 넣으면 뭐가 달라지나요?',
    answer:
      '한자 이름의 글자 수(획수)를 합산해 이름 자체의 오행을 계산하고, 태어난 날의 오행(일간)과 비교해 서로 돕는 관계인지 부딪히는 관계인지를 함께 풀이해드려요. 다만 획수는 간단한 방식(수리오행)으로 계산한 참고용이라, 정식 성명학의 획수 계산법과는 다를 수 있어요.',
  },
  {
    question: '음력으로 입력하면 정확한가요?',
    answer:
      '네, 음력 생년월일도 실제 만세력 변환 라이브러리로 양력으로 정확히 변환한 뒤 계산해요. 윤달에 태어나셨다면 꼭 "윤달이에요" 체크박스를 함께 선택해주세요.',
  },
  {
    question: '오늘의 종합운 점수는 어떻게 정해지나요?',
    answer:
      '오늘 날짜의 일진(干支)과 그대의 일간(태어난 날의 오행)이 서로 돕는 관계(상생)인지, 부딪히는 관계(상극)인지, 같은 오행인지를 계산해서 점수에 반영해요. 상생이면 점수가 오르고 상극이면 내려가는 식이라, 같은 날이어도 태어난 날의 오행에 따라 사람마다 다른 점수가 나와요.',
  },
  {
    question: '이 앱의 운세는 정식 사주 상담과 같은가요?',
    answer:
      '아니에요. 이 앱은 데모 버전으로, 정밀한 만세력 계산 대신 생년월일 기반의 간단한 규칙으로 재미로 볼 수 있는 결과를 생성해요. 인생의 중요한 결정은 전문 상담가와 상의하시길 권장해요.',
  },
];
