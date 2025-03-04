export function classifyTrend(
  data: (number | null)[],
  initialValue: number
): string {
  // Filter out null values
  const cleanedData = data.filter((value): value is number => value !== null);
  if (cleanedData.length < 2) return "Insufficient data";

  // Compute linear regression (least squares method)
  const n = cleanedData.length;
  const x = [...Array(n).keys()]; // Time indices
  const y = cleanedData;

  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Compute first differences (rate of change)
  const differences = y.slice(1).map((val, i) => val - y[i]);
  const avgChange =
    differences.reduce((acc, val) => acc + val, 0) / differences.length;
  const stdDev = Math.sqrt(
    differences.reduce((acc, val) => acc + Math.pow(val - avgChange, 2), 0) /
      differences.length
  );

  // Compute fluctuations by counting sign changes
  let signChanges = 0;
  for (let i = 1; i < differences.length; i++) {
    if (differences[i] * differences[i - 1] < 0) signChanges++;
  }

  // Classification Logic
  if (Math.abs(slope) < 0.1 && stdDev < 0.5)
    return `staying constant.`;
  if (slope > 0 && stdDev < 2)
    return `gradually increasing.`;
  if (slope > 0 && stdDev >= 2)
    return `rapidly increasing.`;
  if (slope < 0 && stdDev < 2)
    return `gradually decreasing.`;
  if (slope < 0 && stdDev >= 2)
    return `rapidly decreasing.`;
  if (signChanges > differences.length * 0.3)
    return `fluctuating.`;

  return `Trend is unclear for initial value ${initialValue}.`;
}
