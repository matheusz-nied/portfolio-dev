const NUMERALS: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(value: number) {
  let rest = Math.max(0, Math.floor(value));
  let out = "";
  for (const [n, glyph] of NUMERALS) {
    while (rest >= n) {
      out += glyph;
      rest -= n;
    }
  }
  return out || "—";
}

/** "2026-03-10" → "X · III · MMXXVI" (calendar date, always read in UTC). */
export function toRomanDate(date: string) {
  const d = new Date(date);
  return [d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear()].map(toRoman).join(" · ");
}
