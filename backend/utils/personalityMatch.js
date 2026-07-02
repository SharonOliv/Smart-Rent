// Very simple MBTI-style compatibility scorer.
// Counts how many of the 4 trait letters two personality types share.
// Returns a 0-100 score so the frontend can sort/display matches.

export const compatibilityScore = (typeA, typeB) => {
  if (!typeA || !typeB) return 0;
  const a = typeA.toUpperCase();
  const b = typeB.toUpperCase();
  if (a.length !== 4 || b.length !== 4) return 0;

  let shared = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) shared += 1;
  }
  return Math.round((shared / 4) * 100);
};
