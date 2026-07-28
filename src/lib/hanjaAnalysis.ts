import cnchar from 'cnchar';
import { getElementRelation as getRelation, type DayPillar, type ElementRelation } from '../data/sajuKnowledge';
import { getHanjaGloss } from './hanjaMeaning';

type Element = DayPillar['element'];

const STROKE_ELEMENT: Record<number, Element> = {
  1: '목',
  2: '목',
  3: '화',
  4: '화',
  5: '토',
  6: '토',
  7: '금',
  8: '금',
  9: '수',
  0: '수',
};

export interface HanjaCharAnalysis {
  char: string;
  strokes: number;
  element: Element;
  gloss: string;
}

export interface NameAnalysis {
  characters: HanjaCharAnalysis[];
  totalStrokes: number;
  element: Element;
}

const HANJA_PATTERN = /[一-鿿]/;

export function isHanjaOnly(value: string): boolean {
  return value.length > 0 && Array.from(value).every((c) => HANJA_PATTERN.test(c));
}

export function sanitizeHanjaInput(value: string): string {
  return Array.from(value)
    .filter((c) => HANJA_PATTERN.test(c))
    .join('');
}

/** 한자 이름의 획수를 합산해 이름의 오행(수리오행)을 계산해요. */
export function analyzeHanjaName(name: string): NameAnalysis | null {
  const chars = Array.from(name).filter((c) => HANJA_PATTERN.test(c));
  if (chars.length === 0) return null;

  const characters: HanjaCharAnalysis[] = chars.map((char) => {
    const strokes = Number(cnchar.stroke(char)) || 0;
    return { char, strokes, element: STROKE_ELEMENT[strokes % 10], gloss: getHanjaGloss(char) };
  });

  const totalStrokes = characters.reduce((sum, c) => sum + c.strokes, 0);

  return {
    characters,
    totalStrokes,
    element: STROKE_ELEMENT[totalStrokes % 10],
  };
}

export function getElementRelation(dayElement: Element, nameElement: Element): ElementRelation {
  return getRelation(dayElement, nameElement);
}

export const RELATION_COMMENT: Record<ElementRelation, (dayElement: Element, nameElement: Element) => string> = {
  same: (d) =>
    `일간과 이름의 기운이 같은 ${d}(五行)으로 맞닿아 있어, 타고난 기질이 이름에서도 그대로 드러나는 사주로다. 뜻을 하나로 모으면 남다른 힘을 발휘하나, 자칫 한쪽으로 치우치기 쉬우니 균형을 잊지 마시게.`,
  firstGeneratesSecond: (d, n) =>
    `일간의 ${d} 기운이 이름의 ${n} 기운을 북돋아주는 좋은 짜임이로다. 타고난 바탕이 이름을 통해 더욱 잘 피어나니, 스스로를 드러내는 일에서 좋은 기운을 얻을 것이오.`,
  secondGeneratesFirst: (d, n) =>
    `이름의 ${n} 기운이 일간의 ${d} 기운을 든든히 받쳐주는 짜임이로다. 스스로도 모르는 사이 이름이 그 기운을 채워주고 있으니, 귀인의 도움을 받기 좋은 사주요.`,
  firstOvercomesSecond: (d, n) =>
    `일간의 ${d} 기운이 이름의 ${n} 기운을 누르는 형국이라, 뜻한 바를 밀어붙이는 힘은 세나 이름이 지닌 부드러움을 놓치기 쉽소. 강하게 나아가되 때로는 유연함도 곁들이시게.`,
  secondOvercomesFirst: (d, n) =>
    `이름의 ${n} 기운이 일간의 ${d} 기운을 다스리는 형국이니, 스스로의 본바탕보다 이름이 만든 인상이 앞서는 사주로다. 이름값을 하려 애쓰는 마음이 부담이 되지 않도록 스스로를 다독이시게.`,
};
