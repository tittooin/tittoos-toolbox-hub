export interface ScoreResult {
  score: number; // 0.0 to 10.0
  confidence: 'HIGH' | 'MEDIUM' | 'ESTIMATED';
  scoreLabel: string;
  breakdown: {
    performance: number;
    value: number;
    display: number;
    battery: number;
    build: number;
  };
}

/**
 * Calculates a deterministic, category-aware Axevora Score (0.0 to 10.0)
 * based on verified specs and price point.
 */
export function calculateAxevoraScore(
  category: string,
  price: number,
  specs: Record<string, string | undefined> = {},
  rating: number = 4.2
): ScoreResult {
  const cat = category.toLowerCase();
  let baseScore = rating * 2; // e.g. 4.4 * 2 = 8.8

  const p = (specs.processor || '').toLowerCase();
  const r = (specs.ram || '').toLowerCase();
  const d = (specs.display || '').toLowerCase();
  const b = (specs.battery || '').toLowerCase();
  const g = (specs.gpu || '').toLowerCase();

  let perfMultiplier = 1.0;
  let valueMultiplier = 1.0;
  let displayMultiplier = 1.0;
  let batteryMultiplier = 1.0;
  let buildMultiplier = 1.0;

  // Category specific weightings
  if (cat.includes('laptop')) {
    if (g.includes('rtx 3050') || g.includes('rtx 4050') || g.includes('rtx 4060')) perfMultiplier += 0.4;
    if (p.includes('ryzen 7') || p.includes('i5-13') || p.includes('i5-12') || p.includes('m1') || p.includes('m2')) perfMultiplier += 0.3;
    if (r.includes('16gb')) perfMultiplier += 0.2;
    if (d.includes('144hz') || d.includes('120hz')) displayMultiplier += 0.3;
    if (price > 0 && price <= 60000 && perfMultiplier > 1.4) valueMultiplier += 0.4;
  } else if (cat.includes('tablet')) {
    if (d.includes('90hz') || d.includes('120hz') || d.includes('2k') || d.includes('retina')) displayMultiplier += 0.4;
    if (b.includes('7000') || b.includes('8000') || b.includes('8360')) batteryMultiplier += 0.3;
    if (r.includes('8gb') || r.includes('6gb')) perfMultiplier += 0.3;
    if (price > 0 && price <= 16000 && displayMultiplier > 1.2) valueMultiplier += 0.3;
  } else if (cat.includes('phone')) {
    if (d.includes('amoled') || d.includes('poled') || d.includes('120hz')) displayMultiplier += 0.4;
    if (p.includes('7 gen') || p.includes('8300') || p.includes('7300') || p.includes('a16')) perfMultiplier += 0.4;
    if (b.includes('5500') || b.includes('6000')) batteryMultiplier += 0.3;
    if (specs.camera && specs.camera.toLowerCase().includes('ois')) buildMultiplier += 0.3;
  } else if (cat.includes('tv')) {
    if (d.includes('qled') || d.includes('quantum') || d.includes('dolby vision')) displayMultiplier += 0.5;
    if (b.includes('30w') || b.includes('36w') || b.includes('atmos')) buildMultiplier += 0.4;
    if (price > 0 && price <= 45000) valueMultiplier += 0.3;
  } else if (cat.includes('audio')) {
    if (d.includes('50db') || d.includes('49db') || d.includes('anc') || p.includes('v1')) displayMultiplier += 0.5;
    if (b.includes('40') || b.includes('65') || b.includes('120')) batteryMultiplier += 0.4;
    if (r.includes('ldac') || r.includes('lhdc') || specs.os?.toLowerCase().includes('ldac')) perfMultiplier += 0.3;
  }

  const performance = Math.min(10, Math.max(7.0, (baseScore * perfMultiplier * 0.95)));
  const display = Math.min(10, Math.max(7.0, (baseScore * displayMultiplier * 0.96)));
  const battery = Math.min(10, Math.max(7.0, (baseScore * batteryMultiplier * 0.94)));
  const value = Math.min(10, Math.max(7.0, (baseScore * valueMultiplier * 0.98)));
  const build = Math.min(10, Math.max(7.0, (baseScore * buildMultiplier * 0.95)));

  const finalScore = Number(((performance * 0.3 + display * 0.2 + battery * 0.2 + value * 0.15 + build * 0.15)).toFixed(1));
  const clampedScore = Math.min(9.8, Math.max(7.5, finalScore));

  let scoreLabel = 'Recommended';
  if (clampedScore >= 9.4) scoreLabel = 'Flagship Benchmark';
  else if (clampedScore >= 9.0) scoreLabel = 'Outstanding';
  else if (clampedScore >= 8.6) scoreLabel = 'Excellent Value';
  else if (clampedScore >= 8.2) scoreLabel = 'Great Choice';

  return {
    score: clampedScore,
    confidence: 'HIGH',
    scoreLabel,
    breakdown: {
      performance: Number(performance.toFixed(1)),
      value: Number(value.toFixed(1)),
      display: Number(display.toFixed(1)),
      battery: Number(battery.toFixed(1)),
      build: Number(build.toFixed(1))
    }
  };
}
