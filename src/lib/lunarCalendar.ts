import KoreanLunarCalendar from 'korean-lunar-calendar';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/** 음력 생년월일을 양력으로 변환해요. 변환 실패(존재하지 않는 날짜) 시 null을 반환해요. */
export function lunarToSolar(year: number, month: number, day: number, isLeapMonth: boolean): SolarDate | null {
  const calendar = new KoreanLunarCalendar();
  const ok = calendar.setLunarDate(year, month, day, isLeapMonth);
  if (!ok) return null;
  return calendar.getSolarCalendar();
}

export function formatSolarDate({ year, month, day }: SolarDate): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}
